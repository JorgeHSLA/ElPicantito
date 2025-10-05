/**
 * Utilidades para normalizar texto removiendo acentos y caracteres especiales
 * Útil para usar con fuentes que no soportan caracteres con tildes como Cucciolo
 */

export class TextUtils {
  
  private static readonly ACCENT_MAP: { [key: string]: string } = {
    // Vocales con acentos minúsculas
    'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ā': 'a', 'ã': 'a', 'ą': 'a',
    'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e', 'ē': 'e', 'ę': 'e',
    'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i', 'ī': 'i', 'į': 'i',
    'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'ō': 'o', 'õ': 'o', 'ø': 'o',
    'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u', 'ū': 'u', 'ų': 'u',
    
    // Vocales con acentos mayúsculas
    'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A', 'Ā': 'A', 'Ã': 'A', 'Ą': 'A',
    'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E', 'Ē': 'E', 'Ę': 'E',
    'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I', 'Ī': 'I', 'Į': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O', 'Ō': 'O', 'Õ': 'O', 'Ø': 'O',
    'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U', 'Ū': 'U', 'Ų': 'U',
    
    // Consonantes especiales
    'ñ': 'n', 'Ñ': 'N',
    'ç': 'c', 'Ç': 'C',
    'ß': 'ss',
    'ł': 'l', 'Ł': 'L'
  };

  /**
   * Remueve todos los acentos y caracteres especiales de un texto
   * @param text - Texto a normalizar
   * @returns Texto sin acentos
   */
  static removeAccents(text: string): string {
    if (!text) return text;
    
    return text.replace(/[áàäâāãąÁÀÄÂĀÃĄéèëêēęÉÈËÊĒĘíìïîīįÍÌÏÎĪĮóòöôōõøÓÒÖÔŌÕØúùüûūųÚÙÜÛŪŲñÑçÇßłŁ]/g, 
      (match) => this.ACCENT_MAP[match] || match);
  }

  /**
   * Normaliza texto para títulos con fuente Cucciolo
   * @param text - Texto del título
   * @returns Texto normalizado
   */
  static normalizeForCucciolo(text: string): string {
    return this.removeAccents(text);
  }

  /**
   * Verifica si un texto contiene caracteres con acentos
   * @param text - Texto a verificar
   * @returns true si contiene acentos
   */
  static hasAccents(text: string): boolean {
    return /[áàäâāãąÁÀÄÂĀÃĄéèëêēęÉÈËÊĒĘíìïîīįÍÌÏÎĪĮóòöôōõøÓÒÖÔŌÕØúùüûūųÚÙÜÛŪŲñÑçÇ]/.test(text);
  }
}