import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicNumber'
})
export class ArabicNumberPipe implements PipeTransform {
  private readonly arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  transform(value: number | string | null, useArabicDigits: boolean = false): string {
    if (value === null || value === undefined) return '';

    const numStr = value.toString();
    
    if (useArabicDigits) {
      return numStr.replace(/[0-9]/g, (digit) => this.arabicDigits[parseInt(digit)]);
    }

    // Format number with Arabic locale
    if (typeof value === 'number') {
      return value.toLocaleString('ar-SA');
    }

    return numStr;
  }
}