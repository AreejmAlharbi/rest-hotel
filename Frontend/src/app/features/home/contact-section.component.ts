// src/app/features/home/contact-section.component.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ContactService, ContactPayload } from '../../core/services/contact.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TranslateModule],
  template: `
  <section id="contact" class="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <div class="mx-auto max-w-7xl px-6 py-16">
    <div class="grid lg:grid-cols-2 gap-10 items-start">

      <!-- معلومات الفندق + خريطة -->
      <div class="space-y-6">
        <header>
          <h2 class="text-3xl md:text-4xl font-bold">
            {{ 'contact.header' | translate }}
          </h2>
          <p class="mt-2 text-slate-300">
            {{ 'contact.intro' | translate }}
          </p>
        </header>

        <ul class="mt-4 space-y-3 text-slate-100">
          <li class="flex items-start gap-3">
            <span class="material-icons-outlined text-slate-300">location_on</span>
            <div>
              <div class="font-medium">
                {{ 'contact.addressLine' | translate }}
              </div>
              <a
                class="text-sky-400 hover:text-sky-300 underline underline-offset-4"
                href="https://www.google.com/maps/search/?api=1&query=Rest%20Hotel%20Al%20Olaya%20Riyadh"
                target="_blank" rel="noopener">
                {{ 'contact.openInMaps' | translate }}
              </a>
            </div>
          </li>

          <li class="flex items-center gap-3">
            <span class="material-icons-outlined text-slate-300">call</span>
            <a class="hover:underline" href="tel:+9665551234567">
              {{ 'contact.phone' | translate }}
            </a>
          </li>

          <li class="flex items-center gap-3">
            <span class="material-icons-outlined text-slate-300">email</span>
            <a class="hover:underline" href="mailto:reservations@resthotel.com">
              {{ 'contact.email' | translate }}
            </a>
          </li>
        </ul>

        <!-- خريطة OSM -->
        <div class="overflow-hidden rounded-2xl">
          <div class="aspect-[16/9]">
            <iframe
              class="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=46.674%2C24.685%2C46.698%2C24.700&layer=mapnik&marker=24.692%2C46.686"
              style="border:0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              [attr.title]="'contact.mapTitle' | translate">
            </iframe>
          </div>
        </div>
      </div>

      <!-- نموذج المراسلة -->
      <div>
        <h3 class="text-4xl font-semibold">
          {{ 'contact.formTitle' | translate }}
        </h3>

        <!-- شريط الحالة -->
        <div *ngIf="sent()"
             class="mt-4 rounded-xl bg-emerald-500/10 text-emerald-300 px-4 py-3">
          {{ 'contact.statusSuccess' | translate }}
        </div>
        <div *ngIf="error()"
             class="mt-4 rounded-xl bg-red-500/10 text-red-300 px-4 py-3">
          {{ 'contact.statusError' | translate }}
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm text-slate-200 mb-1">
              {{ 'contact.fields.name' | translate }}
            </label>
            <input formControlName="name" type="text"
                   class="w-full h-12 rounded-xl bg-white/10 border border-white/10
                          px-3 text-white placeholder:text-slate-300
                          focus:outline-none focus:ring-2 focus:ring-white/30"
                   [placeholder]="'contact.fields.namePh' | translate"/>
          </div>

          <div>
            <label class="block text-sm text-slate-200 mb-1">
              {{ 'contact.fields.email' | translate }}
            </label>
            <input formControlName="email" type="email"
                   class="w-full h-12 rounded-xl bg-white/10 border border-white/10
                          px-3 text-white placeholder:text-slate-300
                          focus:outline-none focus:ring-2 focus:ring-white/30"
                   [placeholder]="'contact.fields.emailPh' | translate"/>
          </div>

          <div>
            <label class="block text-sm text-slate-200 mb-1">
              {{ 'contact.fields.message' | translate }}
            </label>
            <textarea formControlName="message" rows="6"
                      class="w-full rounded-xl bg-white/10 border border-white/10
                             px-3 py-2 text-white placeholder:text-slate-300
                             focus:outline-none focus:ring-2 focus:ring-white/30"
                      [placeholder]="'contact.fields.messagePh' | translate"></textarea>
          </div>

          <!-- نفس لون أزرار البحث -->
          <button
            class="mt-2 h-12 rounded-xl bg-[#2563eb] hover:bg-[#1e54c6] text-white font-medium
                   disabled:opacity-60 disabled:cursor-not-allowed"
            [disabled]="form.invalid || sending()">
            {{ sending() ? ('contact.sending' | translate) : ('contact.send' | translate) }}
          </button>
        </form>
      </div>

    </div>
  </div>
</section>

  `
})
export class ContactSectionComponent {
  private fb = inject(FormBuilder);
  private api = inject(ContactService);

  sending = signal(false);
  sent = signal(false);
  error = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.sending.set(true);
    this.sent.set(false);
    this.error.set(false);

    const payload: ContactPayload = this.form.getRawValue();
    this.api.sendMessage(payload).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.form.reset();
      },
      error: (err) => {
        console.error('[Contact] send error:', err);
        this.sending.set(false);
        this.error.set(true);
      }
    });
  }
}
