import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // ✅ أضفنا TranslateModule
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage, TranslateModule],
  template: `
<header class="bg-slate-100/90 backdrop-blur border-b border-slate-200 text-slate-800">
  <div class="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">

    <!-- Left cluster: Logo + Language toggle -->
    <div class="flex items-center gap-3">
      <!-- Logo -->
      <a routerLink="/" class="flex items-center gap-4 group justify-self-start">
        <span class="inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-slate-300 shadow-md overflow-hidden">
          <img src="assets/logo/logo-resthotel.png" alt="Rest Hotel logo" class="h-full w-full object-cover" />
        </span>
        <span class="text-2xl md:text-3xl font-extrabold tracking-wide text-slate-800">
          <span>{{'brand.name' | translate}}</span> <span class="text-slate-900"> {{'brand.name2' | translate}}</span>
        </span>
      </a>

      <!-- ✅ Language toggle next to logo -->
      <button
        type="button"
        (click)="i18n.toggle()"
        class="rounded-xl border border-slate-300 bg-white text-slate-700 px-3 py-1.5 md:px-4 md:py-2 hover:bg-slate-50"
        [attr.aria-label]="i18n.lang() === 'ar' ? 'Switch to English' : 'بدّل إلى العربية'"
        [title]="i18n.lang() === 'ar' ? 'English' : 'العربية'">
        <span class="hidden md:inline">{{ i18n.lang() === 'ar' ? 'EN' : 'AR' }}</span>
        <span class="md:hidden">{{ i18n.lang() === 'ar' ? 'EN' : 'ع' }}</span>
      </button>
    </div>

    <!-- Right cluster: Nav + Auth -->
    <div class="hidden md:flex items-center gap-8">
      <!-- Nav -->
      <nav class="flex items-center gap-8 text-slate-700">
        <a routerLink="/" [routerLinkActiveOptions]="{ exact:true }"
           routerLinkActive="text-slate-900 font-semibold"
           class="hover:text-slate-900">{{'nav.home' | translate}}</a>

        <a routerLink="/rooms" routerLinkActive="text-slate-900 font-semibold"
           class="hover:text-slate-900">{{'nav.rooms' | translate}}</a>

        <a href="#" (click)="goContact($event)" class="hover:text-slate-900">{{'nav.contact' | translate}}</a>

        <a *ngIf="auth.isAdmin()" routerLink="/admin" class="hover:text-slate-900">{{'nav.admin' | translate}}</a>
      </nav>

      <!-- Auth area -->
      <div class="flex items-center gap-3">
        <ng-container *ngIf="auth.isAuthenticated(); else guest">
          <div class="hidden sm:flex items-center gap-3 mr-1">
            <div class="h-9 w-9 rounded-full bg-slate-800 text-white grid place-items-center text-sm">
              {{ (auth.currentUser()?.fullName || auth.currentUser()?.email || 'U') | slice:0:1 }}
            </div>
            <div class="leading-tight">
              <div class="text-slate-800 text-sm font-semibold">
                {{ auth.currentUser()?.fullName || auth.currentUser()?.email }}
              </div>
              <div class="text-slate-500 text-xs">
                {{ auth.currentUser()?.email }}
              </div>
            </div>
          </div>

          <a routerLink="/account/reservations"
             class="rounded-xl bg-slate-800 text-white px-4 py-2 hover:bg-slate-700">
            {{'bookings' | translate}}
          </a>

          <button type="button"
                  (click)="logout()"
              class="ml-auto rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2 hover:bg-slate-50">
            {{'auth.logout' | translate}}
          </button>
        </ng-container>

        <ng-template #guest>
          <a routerLink="/auth/login"
             class="rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2 hover:bg-slate-50">{{'auth.login' | translate}}</a>
          <a routerLink="/auth/register"
             class="rounded-xl bg-slate-800 text-white px-4 py-2 hover:bg-slate-700">{{'auth.signup' | translate}}</a>
        </ng-template>
      </div>
    </div>

    <!-- Mobile menu button only -->
    <button class="md:hidden inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5">
      Menu
    </button>
  </div>
</header>
`
})
export class NavbarComponent {
  constructor(
    private router: Router,
    public auth: AuthService,
    // ✅ نوفر الخدمة للاستخدام في القالب (i18n.toggle / i18n.lang)
    public i18n: LanguageService
  ) {}

  goContact(e: Event) {
    e.preventDefault();
    const scrollToContact = () =>
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const base = this.router.url.split('#')[0];
    if (base !== '/' && base !== '') {
      this.router.navigate(['/']).then(() => setTimeout(scrollToContact));
    } else {
      scrollToContact();
    }
  }

  logout() {
    this.auth.logout();
  }
}
