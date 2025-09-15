  import 'zone.js'; // لازم قبل أي Bootstrap

// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent  } from './app/app';
// import { routes } from './app/app.routes';

// bootstrapApplication(AppComponent , appConfig)
//   .catch((err) => console.error(err));



// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// 👇 جديد
import { TranslateService } from '@ngx-translate/core';

bootstrapApplication(AppComponent, appConfig)
  .then(ref => {
    const translate = ref.injector.get(TranslateService);

    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const saved = localStorage.getItem('lang') as 'en' | 'ar' | null;
    const lang = saved ?? 'en';

    translate.use(lang);

    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  })
  .catch(err => console.error(err));

  