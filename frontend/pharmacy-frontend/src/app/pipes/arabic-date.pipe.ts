import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicDate'
})
export class ArabicDatePipe implements PipeTransform {
  private readonly arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  private readonly arabicDays = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];

  transform(value: Date | string | null, format: 'short' | 'medium' | 'long' = 'medium'): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    switch (format) {
      case 'short':
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      
      case 'medium':
        return `${date.getDate()} ${this.arabicMonths[date.getMonth()]} ${date.getFullYear()}`;
      
      case 'long':
        return `${this.arabicDays[date.getDay()]}، ${date.getDate()} ${this.arabicMonths[date.getMonth()]} ${date.getFullYear()}`;
      
      default:
        return date.toLocaleDateString('ar-SA');
    }
  }
}