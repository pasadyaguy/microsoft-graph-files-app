import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { AuthHelper } from "../auth/authhelper.service";
import { FileService } from './files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  private files = [];
  private errorMsg = '';
  private UploadSuccess: boolean = false;
  accessToken: string;
  appAccessToken: string;
  public loading = false;

  constructor(http:Http,private auth:AuthHelper, private _fileService: FileService) {
    if(auth.access_token !== null) {
      this.accessToken = auth.access_token;
    } else {
      this.accessToken = 'Not Present';
    }
    if(auth.app_access_token !== null) {
      this.appAccessToken = auth.app_access_token;
    } else {
      this.appAccessToken = 'Not Present';
    }
  }

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.loading = true;
    this.clearSuccess();
    this._fileService.getSharePointFiles()
    .subscribe(data => {
      this.loading = false;
      this.files = data,
      document.getElementById('SuccessBanner').hidden = true;
    },
      //file => this.files = file,
      error => {
        this.loading = false;
        this.errorMsg = <any>error});
  }

  uploadFiles(): void {
    var fileInput = <HTMLInputElement>document.getElementById("fileUpload");
    this._fileService.upload(fileInput)

    //this._fileService.createUploadSession()
    //.subscribe(
    //  data => console.log(data)
    //)
  }

  createUploadSession() {
    this.loading = true;
    var fileInput = <HTMLInputElement>document.getElementById("fileUpload");
    this._fileService.UploadViaSession(fileInput).then(res => {
      console.log(JSON.stringify(res));
      this.loading = false;
    });
    //debugger
    //this._fileService.createUploadSession(fileInput)
    //  .subscribe(
    //    res => console.log(res),
    //    error => console.log(JSON.stringify(error))
    //  )
  }

  clearSuccess(): void {
    document.getElementById('SuccessBanner').hidden = true;
    document.getElementById('FailBanner').hidden = true;
  }
    

}