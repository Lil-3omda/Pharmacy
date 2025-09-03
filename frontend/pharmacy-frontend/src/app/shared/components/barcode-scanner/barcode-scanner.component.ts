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

  private codeReader = new BrowserMultiFormatReader();
  private scanning = false;

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
          this.stopScanning();
        }
      });
    } catch (error) {
      console.error('Error starting barcode scanner:', error);
    }
  }

  stopScanning(): void {
    if (!this.scanning) return;

    this.scanning = false;
    this.codeReader.reset();
    
    const stream = this.videoElement?.nativeElement?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    this.scannerClosed.emit();
  }

  ngOnDestroy(): void {
    this.stopScanning();
  }
}