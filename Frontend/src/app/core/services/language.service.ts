// // src/app/core/services/language.service.ts
// import { Injectable, signal } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

// type Lang = 'en' | 'ar';

// @Injectable({ providedIn: 'root' })
// export class LanguageService {
//   private readonly storageKey = 'app.lang';
//   private _lang = signal<Lang>('en');

//   constructor(private t: TranslateService) {
//     this.t.addLangs(['en', 'ar']);
//     this.t.setDefaultLang('en');

//     const saved = (localStorage.getItem(this.storageKey) as Lang | null) ?? 'en';
//     this.use(saved); // يضبط الترجمة + dir + lang + التخزين
//   }

//   lang(): Lang {
//     return this._lang();
//   }

//   toggle() {
//     this.use(this._lang() === 'en' ? 'ar' : 'en');
//   }

//   use(l: Lang) {
//     this._lang.set(l);
//     this.t.use(l);
//     localStorage.setItem(this.storageKey, l);
//     // اتجاه الصفحة
//     document.documentElement.lang = l;
//     document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
//   }
// }

// src/app/core/services/language.service.ts
// import { Injectable, inject } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

// @Injectable({ providedIn: 'root' })
// export class LanguageService {
//   private translate = inject(TranslateService);

//   init() {
//     const saved = (localStorage.getItem('lang') as 'en' | 'ar') || 'en';
//     this.translate.addLangs(['en', 'ar']);
//     this.translate.setDefaultLang('en');
//     this.use(saved);
//   }

//   lang() { return this.translate.currentLang || 'en'; }

//   toggle() { this.use(this.lang() === 'ar' ? 'en' : 'ar'); }

//   use(lang: 'en' | 'ar') {
//     this.translate.use(lang);
//     localStorage.setItem('lang', lang);
//     document.documentElement.lang = lang;
//     document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
//   }
// }


// src/app/core/services/language.service.ts
// import { Injectable, inject } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

// type Lang = 'en' | 'ar';

// @Injectable({ providedIn: 'root' })
// export class LanguageService {
//   private translate = inject(TranslateService);
//   private _lang: Lang = 'en';   // حالتنا الداخلية فقط

//   init() {
//     const saved = (localStorage.getItem('lang') as Lang) || 'en';

//     this.translate.addLangs(['en', 'ar']);
//     this.translate.setDefaultLang('en');

//     // حمّل اللغة المبدئية وحدث الـ DOM بعد نجاح التحميل
//     this.translate.use(saved).subscribe({
//       next: () => {
//         this._lang = saved;
//         localStorage.setItem('lang', saved);
//         this.applyDirection(saved);
//       },
//       error: (e) => console.error('[i18n] failed to load initial lang', saved, e)
//     });
//   }

//   lang(): Lang { return this._lang; }

//   toggle() {
//     this.use(this._lang === 'ar' ? 'en' : 'ar');
//   }

//   use(lang: Lang) {
//     if (lang === this._lang) return; // ما نبدّل لنفس اللغة

//     // لا نغيّر الـ DOM إلا بعد ما تنجح الترجمة فعلاً
//     this.translate.use(lang).subscribe({
//       next: () => {
//         this._lang = lang;
//         localStorage.setItem('lang', lang);
//         this.applyDirection(lang);
//       },
//       error: (e) => console.error('[i18n] failed to load lang', lang, e)
//     });
//   }

//   private applyDirection(lang: Lang) {
//     const html = document.documentElement;
//     html.lang = lang;
//     html.dir  = lang === 'ar' ? 'rtl' : 'ltr';
//   }
// }

// src/app/core/services/language.service.ts
// src/app/core/services/language.service.ts
// import { Injectable, signal, computed, inject } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

// @Injectable({ providedIn: 'root' })
// export class LanguageService {
//   private translate = inject(TranslateService);
//   private _lang = signal<'en' | 'ar'>((localStorage.getItem('lang') as 'en' | 'ar') || 'en');
//   lang = computed(() => this._lang());

//   init() {
//     // قراءة اللغة المحفوظة وتطبيقها عند الإقلاع
//     const saved = (localStorage.getItem('lang') as 'en' | 'ar') ?? 'en';
//     this.set(saved);
//   }

//   set(lang: 'en' | 'ar') {
//     this._lang.set(lang);
//     localStorage.setItem('lang', lang);
//     this.translate.use(lang);
//     document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
//     document.documentElement.setAttribute('lang', lang);
    
//   }


//   toggle() {
//     this.set(this._lang() === 'ar' ? 'en' : 'ar');
//   }
// }

// src/app/core/services/language.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private t = inject(TranslateService);

  private _lang = signal<Lang>('en');
  // تُستخدَم في القالب: i18n.lang()
  lang = computed(() => this._lang());

  /** نادِها مرة واحدة عند الإقلاع (AppComponent) */
  init() {
    const saved = (localStorage.getItem('lang') as Lang) ?? 'en';
    this.t.addLangs(['en', 'ar']);
    this.t.setDefaultLang('en');
    this.use(saved);         // يضبط النصوص + RTL/LTR بعد ما يحمّل
  }

  toggle() {
    this.use(this._lang() === 'ar' ? 'en' : 'ar');
  }

  /** استخدم هذه لتبديل اللغة مع لوج بعد التحميل */
  use(lang: Lang) {
    if (lang === this._lang()) return;

    this.t.use(lang).subscribe({
      next: () => {
        // ✅ هنا “بعد ما تحمّلت الترجمة” نحدّث الحالة و الـ DOM
        this._lang.set(lang);
        localStorage.setItem('lang', lang);

        const html = document.documentElement;
        html.lang = lang;
        html.dir  = lang === 'ar' ? 'rtl' : 'ltr';

        // 🔎 لوج تشخيصي: يطبع قيمة مفتاح بعد التحميل
        this.t.get('nav.home').subscribe(v =>
          console.log('[i18n] loaded', lang, 'nav.home =', v)
        );
      },
      error: (e) => console.error('[i18n] failed to load lang', lang, e)
    });
  }
}
