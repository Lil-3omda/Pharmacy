import { Component, EventEmitter, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Output() barcodeScanned = new EventEmitter<string>();
  @Output() scannerClosed = new EventEmitter<void>();
  @Output() scannerError = new EventEmitter<string>();

  private codeReader = new BrowserMultiFormatReader();
  public scanning = false;

  async startScanning(): Promise<void> {
    if (this.scanning) return;

    try {
      this.scanning = true;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      this.videoElement.nativeElement.srcObject = stream;

      this.codeReader.decodeFromVideoDevice(undefined, this.videoElement.nativeElement, (result, error) => {
        if (result) {
          this.barcodeScanned.emit(result.getText());
          this.stopScanning(); // Stop after first scan (single-use)
        }

        // Ignore "no code found" errors to prevent log spam
        if (error && error.message !== 'No MultiFormat Readers were able to detect the code.') {
          console.warn('Scanner error:', error);
        }
      });
    } catch (error: any) {
      console.error('Error starting barcode scanner:', error);
      this.scannerError.emit('Camera access denied or not available.');
      this.stopScanning();
    }
  }

 stopScanning(): void {
  if (!this.scanning) return;

  this.scanning = false;

  // stop decoding (unsubscribe from stream)
  this.codeReader.decodeFromVideoDevice(undefined, this.videoElement.nativeElement, () => {});

  // stop camera
  const stream = this.videoElement?.nativeElement?.srcObject as MediaStream;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    this.videoElement.nativeElement.srcObject = null;
  }

  this.scannerClosed.emit();
}



  ngOnDestroy(): void {
    this.stopScanning();
  }
}
