import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as cocoSsd from '@tensorflow-models/coco-ssd';


@Component({
  selector: 'app-test-component',
  template: `
    <div class="container">

      <img style="width: 300px; height: 300px; border-radius: 10px" #cat
           src="{{imgSrc}}"
           alt=""
           crossorigin="anonymous">

      <div>

        <canvas class="canvas" #canvas width="300px" height="300px"></canvas>

        <div style="position: absolute; top: 320px;">

          <img style="width: 100px; height: 100px;" src="{{img2}}" alt="" [ngClass]="imgSrc == img2 ? 'border' : ''" class="pointer"
               (click)="selectImg(img2)">

          <img style="width: 100px; height: 100px;" src="{{img3}}" alt="" [ngClass]="imgSrc == img3 ? 'border' : ''" class="pointer"
               (click)="selectImg(img3)">

          <img style="width: 100px; height: 100px;" src="{{img4}}" alt="" [ngClass]="imgSrc == img4 ? 'border' : ''" class="pointer"
               (click)="selectImg(img4)">

          <hr>

          <img style="width: 100px; height: 100px;" src="{{img5}}" alt="" [ngClass]="imgSrc == img5 ? 'border' : ''" class="pointer"
               (click)="selectImg(img5)">

          <img style="width: 100px; height: 100px;" src="{{img6}}" alt="" [ngClass]="imgSrc == img6 ? 'border' : ''" class="pointer"
               (click)="selectImg(img6)">

          <img style="width: 100px; height: 100px;" src="{{img7}}" alt="" [ngClass]="imgSrc == img7 ? 'border' : ''" class="pointer"
               (click)="selectImg(img7)">

          <form [formGroup]="imgInputForm">

            <p class="text colorGray">Flag for: {{searchFor}}</p>
            <input class="input" #input type="text" formControlName="searchFor">

            <p class="colorGray text">URL:</p>

            <input class="input" #input type="text" formControlName="url">

            <button *ngIf="!disable" [disabled]="disable" class="button" (click)="startScan()">
              <span *ngIf="!predictionResult.length">Start</span>
              <span *ngIf="predictionResult.length">Done</span>
            </button>

            <button *ngIf="disable" [disabled]="disable" class="button loader"> On It...</button>

          </form>

        </div>

      </div>

    </div>
    <!--    <div class="predictions" *ngFor="let result of predictionResult">-->
    <!--      <p>score:  {{result.score}}</p>-->
    <!--      <p>bbox:  {{result.bbox}}</p>-->
    <!--      <p>class:  {{result.class}}</p>-->
    <!--    </div>-->
  `,
  styles: [`
    .container {
      padding-left: 35%;
    }

    .predictions {
      position: relative;
      top: 370px;
    }

    .canvas {
      position: absolute;
      top: 0;
    }

    .pointer {
      cursor: pointer;
    }

    .button {
      display: block;
      min-width: 150px;
      min-height: 50px;
      border: solid 1px gray;
      border-radius: 10px;
      background-color: gray;
      color: white;
      font-size: 16px;
      font-weight: 500;
      margin-left: 75px;
      margin-top: 20px;;
      margin-bottom: 100px;
    }

    .text {
      font-size: 20px;
    }

    .colorGray {
      color: #454d58;
    }

    .input {
      border: solid 2px #454d58;
      border-radius: 10px;
      min-width: 300px;
      min-height: 36px;
      font-size: 16px;
    }

    img {
      border-radius: 10px;
    }
  `]
})

export class TestComponent implements OnInit {

  @ViewChild('cat', {static: true}) cat: ElementRef;
  @ViewChild('canvas', {static: true}) canvas: ElementRef;
  @ViewChild('input', {static: true}) input: ElementRef;

  predictionResult: any[] = [];
  disable = false;

  imgSrc = 'data:image/jpeg;base64,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';
  searchFor = '';

  imgInputForm: FormGroup = this.fb.group({
    url: [`${this.imgSrc}`],
    searchFor: ['cat']
  });

  img2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTpxEQVUh6rV5HJrZILBRYBj9QmYNlG309MoVWI0mcJEgXj3qat';
  img3 = 'data:image/jpeg;base64,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';
  img4 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTv7fTCELkxy8AIkbJs5g8I8I-nbSuuExtQ4irjYa3SAL8rEyeQ';
  img5 = 'https://s31242.pcdn.co/wp-content/uploads/2020/01/bananas-RVWQF7B-1024x683.jpg';
  img6 = 'https://upload.wikimedia.org/wikipedia/commons/7/7f/20e_journ%C3%A9e_du_championnat_de_france_2013-2014_de_Kin-Ball_081.jpg';
  img7 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Football_iu_1996.jpg/1200px-Football_iu_1996.jpg';

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  selectImg(img: string) {
    this.predictionResult = [];
    const context = this.canvas.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.imgSrc = img;
    this.imgInputForm.get('url').setValue(img);
  }

  async startScan() {
    this.searchFor = this.imgInputForm.value.searchFor;
    this.disable = true;
    const context = this.canvas.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    console.log(this.imgInputForm.value.url);
    this.imgSrc = this.imgInputForm.value.url;
    console.log(this.imgSrc);

    console.log('started scan');
    const img = this.cat.nativeElement;

// Load the model.
    const model = await cocoSsd.load();

// Classify the image.
    const predictions = await model.detect(img);
    this.predictionResult = predictions;
    console.log('Predictions: ');
    this.renderPredictions(predictions);
    console.log(predictions);
  }

  renderPredictions = predictions => {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      if (prediction.class.toLocaleLowerCase() === this.searchFor) {
        console.log('im in');
        ctx.strokeStyle = '#AC2824';
      } else {
        ctx.strokeStyle = '#00FFFF';
      }

      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = '#454d58';
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#fff';
      ctx.fillText(prediction.class, x, y);
    });
    this.disable = false;
  };
}
