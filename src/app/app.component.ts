import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { AuthHelper } from './auth/authhelper.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SharePoint Graph Demo App';

  constructor(router:Router, auth:AuthHelper) {
    if (auth.access_token !== null || auth.app_access_token !== null) {
      router.navigate(['/files']);
    }
    else {
      router.navigate(['/login']);
    }
  }
}
