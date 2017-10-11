import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';


import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthHelper } from './auth/authhelper.service';
import { FilesComponent } from './files/files.component';
import { FileService } from './files/files.service'

@NgModule({
  imports: [ 
    BrowserModule,
    FormsModule,
    HttpModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#00529C', 
      secondaryColour: '#00529C', 
      tertiaryColour: '#00529C'
    }),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'files', component: FilesComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
  ])
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    FilesComponent
  ],
  providers: [AuthHelper, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
