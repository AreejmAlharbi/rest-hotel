import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private endpoint = 'https://formspree.io/f/xjkodolg'; // email for contact


  sendMessage(data: ContactPayload): Observable<any> {
    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('email', data.email);
    fd.append('message', data.message);
    
    fd.append('_subject', 'New message from RestHotel website');
    fd.append('reply_to', data.email);

    return this.http.post(this.endpoint, fd, {
      headers: { Accept: 'application/json' },
    });
  }
}
