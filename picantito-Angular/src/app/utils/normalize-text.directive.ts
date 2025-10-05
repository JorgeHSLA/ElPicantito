import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appNormalizeText]',
  standalone: true
})
export class NormalizeTextDirective implements OnInit, OnChanges {
  @Input() appNormalizeText: string | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.normalizeText();
  }

  ngOnChanges() {
    this.normalizeText();
  }

  private normalizeText() {
    const element = this.el.nativeElement;
    const originalText = this.appNormalizeText || element.textContent || element.innerText;
    
    if (originalText) {
      const normalizedText = this.removeAccents(originalText);
      element.textContent = normalizedText;
    }
  }

  private removeAccents(text: string): string {
    const accents: { [key: string]: string } = {
      'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ā': 'a', 'ã': 'a',
      'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A', 'Ā': 'A', 'Ã': 'A',
      'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e', 'ē': 'e',
      'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E', 'Ē': 'E',
      'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i', 'ī': 'i',
      'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I', 'Ī': 'I',
      'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'ō': 'o', 'õ': 'o',
      'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O', 'Ō': 'O', 'Õ': 'O',
      'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u', 'ū': 'u',
      'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U', 'Ū': 'U',
      'ñ': 'n', 'Ñ': 'N',
      'ç': 'c', 'Ç': 'C'
    };

    return text.replace(/[áàäâāãÁÀÄÂĀÃéèëêēÉÈËÊĒíìïîīÍÌÏÎĪóòöôōõÓÒÖÔŌÕúùüûūÚÙÜÛŪñÑçÇ]/g, 
      (match) => accents[match] || match);
  }
}