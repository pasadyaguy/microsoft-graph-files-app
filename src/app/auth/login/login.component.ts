import { Component } from "@angular/core";
import { AuthHelper } from "../authhelper.service";
import { Router } from '@angular/router';


@Component({
    selector: "login",
    templateUrl: "login.component.html",
    moduleId: module.id
})

export class LoginComponent {
	private authHelper:AuthHelper;
	constructor(auth: AuthHelper, private router: Router) {
		this.authHelper = auth;
	}
	
	login() {
		// Use the AuthHelper to start the login flow
		this.authHelper.login();
	}
	
	getAppToken(): void {
		this.authHelper.getAppAccessToken()
		  .subscribe(
				data => {console.log(data),this.router.navigate(['/files'])},
				error => console.log(error)
		  );
	  }
}