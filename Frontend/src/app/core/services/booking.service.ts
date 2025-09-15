import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private base = '/api/reservations';

  // ✅ مويّج بين camel/Pascal → يطّلع دايمًا PascalCase
  private normalize = (x: any): Reservation => ({
    Id:              x.Id              ?? x.id,
    GuestName:       x.GuestName       ?? x.guestName,
    RoomId:          x.RoomId          ?? x.roomId,
    CheckInDate:     x.CheckInDate     ?? x.checkInDate,
    CheckOutDate:    x.CheckOutDate    ?? x.checkOutDate,
    IsCanceled:      x.IsCanceled      ?? x.isCanceled,
    CreatedByUserId: x.CreatedByUserId ?? x.createdByUserId ?? null,
    Room:            x.Room            ?? x.room
  });

  getMine(): Observable<Reservation[]> {
    return this.http.get<any[]>(`${this.base}/mine`).pipe(
      map(arr => arr.map(this.normalize))
    );
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map(this.normalize)
    );
  }

  create(payload: {
    GuestName: string; RoomId: number; CheckInDate: string; CheckOutDate: string;
  }): Observable<Reservation> {
    return this.http.post<any>(this.base, payload).pipe(
      map(this.normalize)
    );
  }

  update(id: number, payload: {
    GuestName: string; CheckInDate: string; CheckOutDate: string;
  }): Observable<Reservation> {
    return this.http.put<any>(`${this.base}/${id}`, payload).pipe(
      map(this.normalize)
    );
  }

  cancel(id: number): Observable<Reservation> {
    return this.http.patch<any>(`${this.base}/${id}/cancel`, {}).pipe(
      map(this.normalize)
    );
  }
}
