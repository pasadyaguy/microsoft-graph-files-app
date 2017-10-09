import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { SvcConsts } from "./svcConsts";

@Injectable()
export class AuthHelper {
	//function to parse the url query string
	private parseQueryString = function(url) {
		var params = {}, queryString = url.substring(1),
		regex = /([^&=]+)=([^&]*)/g, m;
		while (m = regex.exec(queryString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		return params;
	}
	private params = this.parseQueryString(location.hash);
	public access_token:string = null;
	public app_access_token: string = null;
	public token: string = null;
	private AppTokenURL: string = 'https://login.microsoftonline.com/tampageneral.onmicrosoft.com/oauth2/token';
	
	constructor(private http:Http) {
		//check for id_token or access_token in url
		if (this.params["id_token"] != null) {
			this.getAccessToken();
		}	
			//this.getAppAccesTokenWeb();
		else if (this.params["access_token"] != null)
			this.access_token = this.params["access_token"];
			this.token = this.access_token;
			//console.log(this.access_token);
	}
	
	login() {
		//redirect to get id_token
		window.location.href = "https://login.microsoftonline.com/" + SvcConsts.TENANT_ID + 
			"/oauth2/authorize?response_type=id_token&client_id=" + SvcConsts.CLIENT_ID + 
			"&redirect_uri=" + encodeURIComponent(window.location.href) + 
			"&state=SomeState&nonce=SomeNonce";
	}

	private getAccessToken() {
		//redirect to get access_token
		window.location.href = "https://login.microsoftonline.com/" + SvcConsts.TENANT_ID + 
			"/oauth2/authorize?response_type=token&client_id=" + SvcConsts.CLIENT_ID + 
			"&resource=" + SvcConsts.GRAPH_RESOURCE + 
			"&redirect_uri=" + encodeURIComponent(window.location.href) + 
			"&prompt=none&state=SomeState&nonce=SomeNonce";
	}

	public getAppAccessToken(): Observable<any> {
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let opts: RequestOptions = new RequestOptions();
			opts.headers = headers;
		var body = "client_id=" + SvcConsts.CLIENT_ID +
		"&resource=https://graph.microsoft.com" +
		"&client_secret=" + SvcConsts.APP_SECRET +
		"&grant_type=client_credentials"
		var URL = this.AppTokenURL
        return this.http.post(URL, body, opts)
            .do((res: Response) => {this.app_access_token = res.json().access_token, this.token = this.app_access_token})			
            .map((response: Response) => response.json())
            .catch(this.handleError);
	}

	private extractData(response: Response) {
        console.log(response.json().value);
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