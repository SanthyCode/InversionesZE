import { Injectable } from '@angular/core';

// Declaramos las variables globales para que TypeScript no marque error
declare var fbq: any;
declare var ttq: any;

@Injectable({
  providedIn: 'root'
})
export class PixelService {

  constructor() { }

  /**
   * Inicializa los píxeles específicos y registra una vista de página.
   */
registrarVistaPagina(fbPixelId: string, ttPixelId?: string): void {
    // Le damos 500 milisegundos a Meta para que se instale en el navegador
    setTimeout(() => {
      // Facebook
      if (typeof fbq !== 'undefined') {
        fbq('init', fbPixelId);
        fbq('trackSingle', fbPixelId, 'PageView');
        console.log('Píxel de Meta inicializado correctamente'); // <- Agrega esto para depurar
      } else {
        console.warn('El script de Meta fue bloqueado por el navegador');
      }

      // TikTok
      if (typeof ttq !== 'undefined' && ttPixelId) {
        ttq.load(ttPixelId); 
        ttq.page(); 
      }
    }, 500);
  }

  /**
   * Dispara un evento de conversión (ej: 'Lead', 'SubmitForm')
   */
  rastrearEvento(fbPixelId: string, fbEvento: string, ttEvento: string = 'SubmitForm'): void {
    // Facebook
    if (typeof fbq !== 'undefined') {
      fbq('trackSingle', fbPixelId, fbEvento);
    }

    // TikTok
    if (typeof ttq !== 'undefined') {
      ttq.track(ttEvento);
    }
  }
}