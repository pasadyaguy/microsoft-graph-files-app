import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client"
import * as FileReaderStream from 'filereader-stream';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { AuthHelper } from "../auth/authhelper.service";
import { SvcConsts } from '../auth/svcConsts';
import { FilesComponent } from './files.component'


@Injectable()
export class FileService {
    
    private errorMsg: any;    

    constructor(
        private http:Http, 
        private auth:AuthHelper ) {
        
    }

    getClient(): MicrosoftGraphClient.Client {
        var client = MicrosoftGraphClient.Client.init({
            authProvider: (done) => {
                done(null, this.auth.token);
            }
        });
        return client;
    }

    getOneDriveFiles(): Observable<any> {
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.auth.token);
        let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;
        var URL = SvcConsts.GRAPH_URL + '/me/drive/root/children';
        return this.http.get(URL, opts)
            .do(data => console.log(JSON.stringify(data)))
            .map(this.extractData)
            .catch(this.handleError);

    }

    getSharePointFiles(): Observable<any> {
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.auth.token);
        let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;
        var URL = SvcConsts.GRAPH_URL + '/drives/' + SvcConsts.DRIVE_ID + '/root:/TicketID:/children';
        return this.http.get(URL, opts)
            //.do(data => console.log(JSON.stringify(data)))
            .map(this.extractData)
            .catch(this.handleError);
    }

    upload(file: HTMLInputElement) {
        var item = file.files[0];
        var success: boolean = false;
        var fileName = item.name;
        var client = this.getClient();
        var returnValue: any;
        var URL = SvcConsts.GRAPH_URL + '/drives/' + SvcConsts.DRIVE_ID + '/root:/TicketID/' + fileName + ':/content';
        client
            .api(URL)
            .put(item, (err, res) => {
                if (err) {
                    console.log(err);
                    document.getElementById('FailBanner').hidden = false;
                } else {
                    console.log('File Uploaded Successfully');
                    document.getElementById('SuccessBanner').hidden = false;
                }
                
            });
    }

    //****************************************************************************//
    //              UPLOAD VIA SESSION - START                                    //
    //****************************************************************************//
    public UploadViaSession(fileInput: HTMLInputElement) {
        var file = fileInput.files[0];
        var size = file.size;
        var sliceSize = 40 * 320 * 320;
        var start = 0;
        var session: any;
        //debugger
        this.CreateSession(file.name)
            .subscribe(
                res => {
                    session = res;
                    setTimeout(this.GetBytes(file, start, size, sliceSize, session), 1);
                },
                error => this.handleError
            )

        
    }

    private CreateSession(fileName: string): Observable<any> {
        var body = '';
        var headers = new Headers();
        headers.append('Authorization', this.auth.token);
        headers.append('Content-Type', 'application/json');
        var url = SvcConsts.GRAPH_URL + '/drives/' + SvcConsts.DRIVE_ID + '/root:/TicketID/' + fileName + ':/createUploadSession';
        return this.http.post(url, body, { headers })
            .map(this.ExtractSessionResponse)
            .catch(this.handleError)
    }

    private ExtractSessionResponse(response: any) {
        //debugger
        var body = response._body;
        let res = JSON.parse(body);
        return res;
    }

    private GetBytes(file: File, start: number, size: number, sliceSize: number, session: any) {
        //debugger        
        var end = start + sliceSize;
        
        if (size - end < 0) {
            end = size;
        }

        var s = this.slice(file, start, end);

        this.SendToSession(s, start, end, file, session)
            .subscribe(
                res => {
                    //debugger
                    console.log(res);
                    if (this.CheckEndOfFile(end, size, sliceSize, file, start, session)) {
                        alert('Success');
                    } else {
                        console.log('Getting Next Chunk...');
                    }
                },
                err => this.handleError
            )
        
           
    }

    private CheckEndOfFile(end: number, size: number, sliceSize: number, file: File, start: number, session: any ): boolean {
        //debugger
        if (end < size) {
            start += sliceSize;
            setTimeout(this.GetBytes(file, start, size, sliceSize, session), 1);
            return false;
        }  else {
            return true;
        }
    }

    private slice(file: File, start: number, end: number) {
        var slice = file.slice ? file.slice : this.noop;

        return slice.bind(file)(start, end);
    }

    private noop() {}

    private SendToSession(chunk: any, start: any, end: any, file: File, session: any): Observable<any> {
        //debugger
        var headers = new Headers();
        //headers.append('Content-Length', fileData.length);
        var range = 'bytes ' + start + '-' + (end - 1) + '/' + file.size;
        headers.append('Content-Range', range);
        let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;

        return this.http.put(session.uploadUrl, chunk, opts)
            .map(this.ExtractSessionResponse)
            .catch(this.handleError);
    }

    //****************************************************************************//
    //              UPLOAD VIA SESSION - END                                      //
    //****************************************************************************//


    private extractData(response: Response) {
        //console.log(response.json().value);
        return response.json().value;
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            console.log(JSON.stringify(error));
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}