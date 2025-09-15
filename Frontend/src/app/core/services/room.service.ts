// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';
// import { RoomDto } from '../models/room.model';

// @Injectable({ providedIn: 'root' })
// export class RoomService {
//   private http = inject(HttpClient);
//   private base = '/api/rooms';

//   // كل الغرف (للاستخدام العام)
//   getAll(): Observable<RoomDto[]> {
//     return this.http.get<RoomDto[]>(this.base);
//   }

//   // أحدث 3 غرف: نفرز بالـ id تنازليًا (الباكند ما يرجّع createdAt)
//   getLatest3(): Observable<RoomDto[]> {
//     return this.getAll().pipe(
//       map(arr => [...arr].sort((a,b) => b.id - a.id).slice(0, 3))
//     );
//   }
// }


import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Room, RoomDto, toRoom } from '../models/room.model';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';


@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private base = '/api/rooms';

  /** جميع الغرف بصيغة UI (Room) */
  getAll(): Observable<Room[]> {
    return this.http.get<RoomDto[]>(this.base).pipe(
      map(dtos => dtos.map(toRoom))
    );
  }

  /** أحدث 3 غرف (نفرز محليًا على id تنازليًا لعدم وجود createdAt) */
  getLatest3(): Observable<Room[]> {
    return this.getAll().pipe(
      map(arr => [...arr].sort((a, b) => b.id - a.id).slice(0, 3))
    );
  }

 searchAvailable(params: { checkIn: string; checkOut: string }): Observable<RoomDto[]> {
    const httpParams = new HttpParams()
      .set('checkIn', params.checkIn)
      .set('checkOut', params.checkOut);

    // backend: GET /api/rooms/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
    return this.http.get<RoomDto[]>(`${this.base}/available`, { params: httpParams });
  }


// src/app/core/services/room.service.ts (إضافة دالة getById)
getById(id: number): Observable<RoomDto> {
  return this.http.get<RoomDto>(`${this.base}/${id}`);
}

}
