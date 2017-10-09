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
    this._fileService.getSharePointFiles()
    .subscribe(data => {
      this.files = data,
      document.getElementById('SuccessBanner').hidden = true;
    },
      //file => this.files = file,
      error => this.errorMsg = <any>error);
  }

  uploadFiles(): void {
    var fileInput = <HTMLInputElement>document.getElementById("fileUpload");
    this._fileService.upload(fileInput);
    //this._fileService.createUploadSession()
    //.subscribe(
    //  data => console.log(data)
    //)
  }

  clearSuccess(): void {
    document.getElementById('SuccessBanner').hidden = true;
  }
    

}