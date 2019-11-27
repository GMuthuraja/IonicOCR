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
  resultText: any;
  resultProp: any;

  constructor(private ocr: OCR, private camera: Camera) { }

  openOCR() {

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.ocr.recText(OCRSourceType.NORMFILEURL, imageData)
        .then((res: OCRResult) => {

          let two_lines = res.blocks.blocktext.toString();

          console.log("res", res);
          console.log("two_lines", two_lines);

          this.imageText = two_lines.replace(/ /g, "") //replaces white spaces
            .replace(/(\r\n|\n|\r)/gm, "") // replaces new line char
            .replace(/\s/g, "")
            .replace(/,/g, '') //replaces comma
            .toUpperCase();


          console.log("this.imageText", this.imageText);

          let docType,
            country,
            nationality,
            id,
            name,
            surname,
            birthDate,
            expirationDate,
            sex,
            mrz;


          // Passports have 88 chars and start with 'P'
          let last_twolines = this.imageText.substring(this.imageText.length - 88);
          last_twolines.substring(0, 1) === 'P' ? (docType = 'PASSPORT') && (mrz = last_twolines) : mrz = '';

          console.log("last_twolines", last_twolines);

          if (docType === 'PASSPORT') {
            const line1 = mrz
              .slice(0, 44)
              .split("<<")
              .filter(text => text);
            const line2 = mrz.slice(44, 88);
            country = line1[0].slice(2, 5).replace(/</g, "");
            name = line1[1].replace(/</g, " ");
            surname = line1[0].slice(5, line1[0].length).replace(/</g, " ");
            id = line2.slice(0, 9).replace(/</g, "");
            nationality = line2.slice(10, 13).replace(/</g, "");
            birthDate = line2.slice(13, 19);
            sex = line2[20] === 'M' ? 'MALE' : 'FEMALE';
            expirationDate = line2.slice(21, 27);


            console.log(line1[0]);
            console.log(line1);
            console.log(line2);
            console.log(country);
            console.log(nationality);
            console.log(id);
            console.log(name);
            console.log(surname);
            console.log(birthDate);
            console.log(expirationDate);
            console.log(sex);

            this.resultProp = [
              "Country",
              "Nationality",
              "Id",
              "Name",
              "Surname",
              "BirthDate",
              "ExpirationDate",
              "Sex"
            ]

            this.resultText = {
              "Country": country,
              "Nationality": nationality,
              "Id": id,
              "Name": name,
              "Surname": surname,
              "BirthDate": birthDate,
              "ExpirationDate": expirationDate,
              "Sex": sex
            }

          } else {
            alert("Sorry, we couldn't read your passport. Please try again!");
          }
        }).catch((error: any) => console.error(error));
    }, (err) => {
      console.log(err);
    });
  }
}
