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
    // Facebook
    if (typeof fbq !== 'undefined') {
      fbq('init', fbPixelId);
      fbq('trackSingle', fbPixelId, 'PageView');
    }

    // TikTok (Opcional, solo si pasas el ID)
    if (typeof ttq !== 'undefined' && ttPixelId) {
      // Nota: TikTok suele usar load en lugar de init
      ttq.load(ttPixelId); 
      ttq.page(); 
    }
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