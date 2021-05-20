import { Component, ElementRef, ViewChild } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('video', { static: true }) video: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  data;
  videoStart = false;
  medias: MediaStreamConstraints = {
    audio: false,
    video: false,
  };

  toggleVideoMedia() {
    if (this.videoStart) {
      this.stopVideo();
    } else {
      this.startVideo()
    }
  }

  startVideo() {
    this.medias.video = true;
    navigator.mediaDevices.getUserMedia(this.medias).then(
      (localStream: MediaStream) => {
        this.video.nativeElement.srcObject = localStream;
        this.videoStart = true;
        this.checkImage();
      }
    ).catch(
      error => {
        console.error(error);
        this.videoStart = false;
      }
    );
  }

  stopVideo() {
    this.medias.video = false;
    this.video.nativeElement.srcObject.getVideoTracks()[0].enabled = false;
    this.video.nativeElement.srcObject.getVideoTracks()[0].stop();
    this.videoStart = false;
  }

  checkImage() {
    const WIDTH = this.video.nativeElement.clientWidth;
    const HEIGHT = this.video.nativeElement.clientHeight;
    this.canvas.nativeElement.width  = WIDTH;
    this.canvas.nativeElement.height = HEIGHT;

    const ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    ctx.drawImage(this.video.nativeElement, 0, 0, WIDTH, HEIGHT)
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" })

    if (code) {
      this.data = code.data;
      console.log(code);
    } else {
      setTimeout(() => { this.checkImage(); }, 100)
    }
  }

}
