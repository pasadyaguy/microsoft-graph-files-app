import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { AuthHelper } from "../auth/authhelper.service";
import { SvcConsts } from '../auth/svcConsts';


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
        var fileName = this.renameFile(item.name);
        var client = this.getClient();
        var URL = SvcConsts.GRAPH_URL + '/drives/' + SvcConsts.DRIVE_ID + '/root:/TicketID/' + fileName + ':/content';
        client
            .api(URL)
            .put(item, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log('File Uploaded Successfully');
                document.getElementById('SuccessBanner').hidden = false;
            });
    }


    // Create Upload Session is still a work in progress and does not function correct at the moment.....
    createUploadSession(): Observable<any> {
        var fileInput = <HTMLInputElement>document.getElementById("fileUpload");
        var fileName = this.renameFile(fileInput.files[0].name);
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.auth.token);
        headers.append('Content-Type', 'application/json');
        let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;
        var URL = SvcConsts.GRAPH_URL + '/drives/' + SvcConsts.DRIVE_ID + '/TicketID/'+fileName+':/createUploadSession'
        return this.http.post(URL, opts)
            .map(this.extractData)
            .catch(this.handleError);
    }

    renameFile(name: string): String {
        var FileName = 'TicketID_' + name;
        return FileName;
    }


    private extractData(response: Response) {
        //console.log(response.json().value);
        return response.json().value;
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
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