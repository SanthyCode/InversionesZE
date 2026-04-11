import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

declare var fbq: any;
declare var ttq: any;

@Component({
  selector: 'app-cotiza-seguro',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cotiza-seguro.component.html',
  styleUrls: ['./cotiza-seguro.component.scss']
})
export class CotizaSeguroComponent implements OnInit {
  cotizaForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  // ⚠️ REEMPLAZA CON TU URL DE GOOGLE APPS SCRIPT
  private readonly scriptURL = 'https://script.google.com/macros/s/AKfycbz3vMwx1mZQCv8lYRaRbxf78biCQbgLAwdCU9JZDSHR82ybhjSlE3ptEarZTleYbIlWhA/exec';
  private readonly miNumeroWpp = '573016743186';

  ngOnInit(): void {
    this.cotizaForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      celular: ['', Validators.required],
      placa: ['', Validators.required]
    });
  }

  enviarFormulario(): void {
    if (this.cotizaForm.invalid) {
      this.cotizaForm.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const data = this.cotizaForm.value;
    const urlParams = new URLSearchParams();
    
    // Agregar fecha
    const fecha = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota'
    });
    urlParams.append('fecha', fecha);
    urlParams.append('tipo', 'Cotización Seguro Todo Riesgo');
    
    // Agregar todos los datos del formulario
    Object.keys(data).forEach(key => {
      urlParams.append(key, data[key]);
    });

    // Construir mensaje para WhatsApp
    const mensajeWpp = `¡Hola! Solicito una cotización de seguro todo riesgo:
*Nombre:* ${data.nombre}
*Cédula:* ${data.cedula}
*Celular:* ${data.celular}
*Placa del Vehículo:* ${data.placa}`;

    const urlWhatsApp = `https://wa.me/${this.miNumeroWpp}?text=${encodeURIComponent(mensajeWpp)}`;

    // 🔥 TRUCO ANTI-BLOQUEO: Abrimos la pestaña en blanco antes de la petición async
    const nuevaPestana = window.open('about:blank', '_blank');

    // Enviar a Google Sheets
    fetch(this.scriptURL, { 
      method: 'POST', 
      body: urlParams, 
      mode: 'no-cors' 
    })
      .then(() => {
        // Píxeles
        if (typeof fbq !== 'undefined') fbq('track', 'Lead');
        if (typeof ttq !== 'undefined') ttq.track('SubmitForm');

        // Redirigir la pestaña que abrimos a WhatsApp
        if (nuevaPestana) {
          nuevaPestana.location.href = urlWhatsApp;
        } else {
          // Fallback por si el navegador fue muy estricto y bloqueó el window.open
          window.location.href = urlWhatsApp;
        }
        
        // Limpiamos el formulario en tu página original
        this.cotizaForm.reset();
      })
      .catch(error => {
        console.error('Error al guardar:', error);
        if (nuevaPestana) nuevaPestana.location.href = urlWhatsApp;
        else window.location.href = urlWhatsApp;
      });
  }
}
