// src/app/i18n/json-translate-loader.ts
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';

export class JsonTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix = 'assets/i18n/',
    private suffix = '.json'
  ) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get<any>(`${this.prefix}${lang}${this.suffix}`);
  }
}
