import { NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer';

export default class WatsonVisualRecognition {
  apikey: string;
  url: string;
  modelId: string;
  camera: Camera;
  isOpen: boolean;
  fileTransfer: FileTransferObject;

  constructor(
    apiKey,
    url,
    modelId,
    private ngZone: NgZone,
    private platform: Platform
  ) {
    this.apikey = apiKey;
    this.url = url;
    this.modelId = modelId;
    this.camera = new Camera();
    this.isOpen = false;
  }

  takePicture(imageElement, resultElement, spinnerElement, resultTable, callback): void {
    // imageElement.setAttribute('src', 'http://www.redbooks.ibm.com/images/fp/cognitiveapps/visualrecognition.svg');
    resultElement.innerHTML = '';

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    const self = this;
    this.ngZone.run(() => {
      this.camera.getPicture(options).then(
        imageData => {
          if (this.platform.is('android') || this.platform.is('ios')) {
            // logoIcon.setAttribute('hidden', true);
            imageElement.setAttribute(
              'src',
              (<any>window).Ionic.WebView.convertFileSrc(imageData)
            );
            self.doRecognition(
              imageData,
              resultElement,
              spinnerElement,
              resultTable,
              callback
            );
          } else {
            // logoIcon.setAttribute('hidden', true);
            imageElement.setAttribute(
              'src',
              'data:image/png;base64, ' + imageData
            );
            self.doRecognitionForWeb(
              imageData,
              resultElement,
              spinnerElement,
              resultTable,
              callback
            );
          }
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  chooseFromGallery(
    imageElement,
    resultElement,
    spinnerElement,
    resultTable,
    callback
  ): void {
    // imageElement.setAttribute('src', 'http://www.redbooks.ibm.com/images/fp/cognitiveapps/visualrecognition.svg');
    resultElement.innerHTML = '';

    const options = {
      maximumImagesCount: 1,
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 200,
      targetHeight: 200
    };

    const self = this;
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.camera.getPicture(options).then(
        imageData => {
          // logoIcon.setAttribute('hidden', true);
          imageElement.setAttribute(
            'src',
            (<any>window).Ionic.WebView.convertFileSrc(imageData)
          );
          self.doRecognition(
            imageData,
            resultElement,
            spinnerElement,
            resultTable,
            callback
          );
        },
        err => {
          console.log(err);
        }
      );
    } else {
      return;
    }
  }

  uploadForWeb(image, imageElement, resultElement, spinnerElement,resultTable,callback) {
    const self = this;
    imageElement.setAttribute(
      'src',
      'data:image/png;base64, ' + image
    );
    self.doRecognitionForWeb(
      image,
      resultElement,
      spinnerElement,
      resultTable,
      callback
    );
  }

  fetchResults(result) {
    let classes = result.images[0].classifiers[0].classes;
    let array = [];
    for (let i = 0; i < classes.length; i++) {
      let div =
        '<tr><th style="padding:10px; text-align:left">' +
        classes[i].class +
        '</th>' +
        '<th>' +
        (classes[i].score * 100).toFixed(1) +
        '%</th></tr>';
      array.push(div);
    }
    return array;
  }

  doRecognition(imageUri, resultElement, spinnerElement, resultTable, callback) {
    spinnerElement.style.visibility = 'visible';
    const self = this;
    let options: FileUploadOptions = {
      fileKey: 'images_file',
      fileName: imageUri.substr(imageUri.lastIndexOf('/') + 1)
    };

    var parser = document.createElement('a');
    parser.href = this.url;

    if (this.fileTransfer == null) {
      this.fileTransfer = new FileTransfer().create();
    }

    this.fileTransfer
      .upload(
        imageUri,
        'https://apikey:' +
          this.apikey +
          '@' +
          parser.hostname +
          parser.pathname +
          '/v3/classify?version=2018-03-19&owners=me&classifier_ids=' +
          this.modelId +
          '&threshold=0.0',
        options
      )
      .then(
        data => {
          spinnerElement.style.visibility = 'hidden';
          console.log(data);
          let array = self.fetchResults(JSON.parse(data.response));
          resultElement.style.display = 'none';
          resultTable.innerHTML = array.toString().replace(/,/g, '');
          return callback(
            null,
            JSON.parse(data.response).images[0].classifiers[0].classes[0].class
          );
        },
        err => {
          spinnerElement.style.visibility = 'hidden';
          console.log(JSON.stringify(err));
          resultElement.innerHTML = 'An error has occurred: Code = ' + err.code;
          resultTable.style.display = 'none';
          return callback(err);
        }
      );
  }

  doRecognitionForWeb(imageData, resultElement, spinnerElement,resultTable,callback) {
    spinnerElement.style.visibility = 'visible';
    const self = this;
    var parser = document.createElement('a');
    parser.href = this.url;

    let rawData = window.atob(imageData);
    let rawLength = rawData.length;
    let blobArray = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      blobArray[i] = rawData.charCodeAt(i);
    }
    let blob = new Blob([blobArray]);
    let formData = new FormData();
    formData.append('images_file', blob);
    formData.append('classifier_ids', this.modelId);
    formData.append('threshold', '0.0');

    let xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      'https://' +
        parser.hostname +
        parser.pathname +
        '/v3/classify?version=2018-03-19',
      true
    );
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + window.btoa('apiKey:' + this.apikey)
    );
    xhr.onload = function() {
      spinnerElement.style.visibility = 'hidden';
      let results = self.fetchResults(JSON.parse(this.response));
      resultElement.style.display = 'none';
      resultTable.innerHTML = results.toString().replace(/,/g, '');
      self.isOpen = false;
      return callback(
        null,
        JSON.parse(this.response).images[0].classifiers[0].classes[0].class
      );
    };

    xhr.onerror = function() {
      spinnerElement.style.visibility = 'hidden';
      resultElement.innerHTML = 'An error has occurred: Code = ' + this.status;
      resultTable.style.display = 'none';
      self.isOpen = false;
      return callback(this.response);
    };
    xhr.send(formData);
  }
}
