import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PixelService } from '../../services/pixel.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  contactoForm!: FormGroup;

  // ⚠️ IDs de tus Píxeles
  private readonly PIXEL_FB_CONTACTO = '971546888680397';
  // private readonly PIXEL_TT_CONTACTO = 'TU_ID_DE_TIKTOK'; // Descomenta cuando lo tengas

  // Tus credenciales
  private readonly scriptURL = 'https://script.google.com/macros/s/AKfycbz3vMwx1mZQCv8lYRaRbxf78biCQbgLAwdCU9JZDSHR82ybhjSlE3ptEarZTleYbIlWhA/exec';
  private readonly miNumeroWpp = '573503486467';

  constructor(
    private fb: FormBuilder,
    private pixelService: PixelService
  ) { }

  ngOnInit(): void {
    // 1. Inicializamos el formulario
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      servicio: ['', Validators.required],
      mensaje: ['']
    });

    // 2. Registramos la visita a la página para este píxel exacto
    this.pixelService.registrarVistaPagina(this.PIXEL_FB_CONTACTO);
  }

  enviarFormulario(): void {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const data = this.contactoForm.value;
    const urlParams = new URLSearchParams();
    
    // Agregar fecha
    const fecha = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota'
    });
    urlParams.append('fecha', fecha);
    
    // Agregar todos los datos del formulario
    Object.keys(data).forEach(key => {
      urlParams.append(key, data[key]);
    });

    // Construir mensaje para WhatsApp
    const mensajeWpp = `¡Hola! Tengo una consulta:
*Nombre:* ${data.nombre}
*Teléfono:* ${data.telefono}
*Correo:* ${data.correo}
*Servicio:* ${data.servicio}
${data.mensaje ? `*Mensaje:* ${data.mensaje}` : ''}`;

    const urlWhatsApp = `https://wa.me/${this.miNumeroWpp}?text=${encodeURIComponent(mensajeWpp)}`;

    // 🔥 TRUCO ANTI-BLOQUEO
    const nuevaPestana = window.open('about:blank', '_blank');

    // Enviar a Google Sheets
    fetch(this.scriptURL, { 
      method: 'POST', 
      body: urlParams, 
      mode: 'no-cors' 
    })
      .then(() => {
        // 🚀 Disparar evento de Lead mediante el servicio
        this.pixelService.rastrearEvento(this.PIXEL_FB_CONTACTO, 'Lead', 'SubmitForm');

        // Redirigir la pestaña a WhatsApp
        if (nuevaPestana) {
          nuevaPestana.location.href = urlWhatsApp;
        } else {
          window.location.href = urlWhatsApp;
        }
        
        // Limpiar formulario
        this.contactoForm.reset();
      })
      .catch(error => {
        console.error('Error al guardar:', error);
        if (nuevaPestana) nuevaPestana.location.href = urlWhatsApp;
        else window.location.href = urlWhatsApp;
      });
  }
}