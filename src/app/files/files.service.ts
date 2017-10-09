import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { AuthHelper } from "../auth/authhelper.service";


@Injectable()
export class FileService {
    private graphOneDriveURL: string = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
    private graphSiteURL: string = 'https://graph.microsoft.com/v1.0/drives/b!eC-nM_sR10Smhb6zJNbaFc3nK5PMYddAr9c_7w7MhFrpm_XRLZNBTZ30pyiSxkDI/root/children';
    private graphSiteURL2: string = 'https://graph.microsoft.com/v1.0/drives/b!eC-nM_sR10Smhb6zJNbaFc3nK5PMYddAr9c_7w7MhFpF1sjg7ETcRrY-cndlAQ8l/root/children';
    private graphUploadURL: string = 'https://graph.microsoft.com/v1.0/drives/b!eC-nM_sR10Smhb6zJNbaFc3nK5PMYddAr9c_7w7MhFpF1sjg7ETcRrY-cndlAQ8l/root:';
    private graphFolderURL: string = 'https://graph.microsoft.com/v1.0/drives/b!eC-nM_sR10Smhb6zJNbaFc3nK5PMYddAr9c_7w7MhFpF1sjg7ETcRrY-cndlAQ8l/root:/TicketID:/children';
    private errorMsg: any;
    private authHelper: AuthHelper;


    constructor(
        private http:Http, auth:AuthHelper) {
            this.authHelper = auth;
    }

    getClient(): MicrosoftGraphClient.Client {
        var client = MicrosoftGraphClient.Client.init({
            authProvider: (done) => {
                done(null, this.authHelper.token);
            }
        });
        return client;
    }

    getOneDriveFiles(): Observable<any> {
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.authHelper.token);
        let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;
        return this.http.get(this.graphOneDriveURL, opts)
            .do(data => console.log(JSON.stringify(data)))
            .map(this.extractData)
            .catch(this.handleError);

    }

    getSharePointFiles(): Observable<any> {
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.authHelper.token);
        let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;
        return this.http.get(this.graphFolderURL, opts)
            //.do(data => console.log(JSON.stringify(data)))
            .map(this.extractData)
            .catch(this.handleError);
    }

    upload(file: HTMLInputElement) {
        var item = file.files[0];
        var success: boolean = false;
        var fileName = this.renameFile(item.name);
        var client = this.getClient();
        client
            .api('https://graph.microsoft.com/v1.0/drives/b!eC-nM_sR10Smhb6zJNbaFc3nK5PMYddAr9c_7w7MhFpF1sjg7ETcRrY-cndlAQ8l/root:/TicketID/'+fileName+':/content')
            .put(item, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log('File Uploaded Successfully');
                document.getElementById('SuccessBanner').hidden = false;
            });
    }

    createUploadSession(): Observable<any> {
        var fileInput = <HTMLInputElement>document.getElementById("fileUpload");
        var fileName = this.renameFile(fileInput.files[0].name);
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.authHelper.token);
        headers.append('Content-Type', 'application/json');
        let opts: RequestOptions = new RequestOptions();
            opts.headers = headers;
        var URL = this.graphUploadURL + '/TicketID/'+fileName+':/createUploadSession'
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