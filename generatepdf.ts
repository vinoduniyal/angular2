import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.css']
})
export class PdfGeneratorComponent {
  @ViewChild('tab1') tab1!: ElementRef;
  @ViewChild('tab2') tab2!: ElementRef;
  @ViewChild('tab3') tab3!: ElementRef;

  generatePDF() {
    const doc = new jsPDF();
    const options = { background: 'white', scale: 2 };

    const captureTab = (tabElement: ElementRef, yOffset: number): Promise<number> => {
      return new Promise((resolve) => {
        html2canvas(tabElement.nativeElement, options).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          doc.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
          resolve(yOffset + imgHeight + 10);
        });
      });
    };

    let yOffset = 10;
    captureTab(this.tab1, yOffset)
      .then((newYOffset) => captureTab(this.tab2, newYOffset))
      .then((newYOffset) => captureTab(this.tab3, newYOffset))
      .then(() => doc.save('tabs-data.pdf'));
  }
}
