import { Component } from '@angular/core';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  imageText: any;

  constructor(private ocr: OCR, private camera: Camera) { }

  openOCR() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.ocr.recText(OCRSourceType.NORMFILEURL, imageData)
        .then((res: OCRResult) => {
          this.imageText = JSON.stringify(res);
          console.log(this.imageText);
        }).catch((error: any) => console.error(error));
    }, (err) => {
      console.log(err);
    });
  }

  openDocument() {
   
  }
}
