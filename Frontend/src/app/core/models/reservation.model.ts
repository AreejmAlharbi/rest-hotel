

// src/app/core/models/reservation.model.ts
import { RoomDto } from './room.model';

/** === مطابقة للباكند تمامًا (PascalCase) === */
export interface ReservationDto {
  Id: number;
  GuestName: string;
  RoomId: number;
  CheckInDate: string;
  CheckOutDate: string;
  IsCanceled: boolean;
  Room?: any; // أو RoomDto بصيغة PascalCase لو رجعت من الباك

  /** ✅ جديد ليتماشى مع الباكند */
  CreatedByUserId?: number | null;
}

export interface CreateReservationDto {
  GuestName: string;
  RoomId: number;
  CheckInDate: string;
  CheckOutDate: string;
}

export interface UpdateReservationDto {
  GuestName: string;
  CheckInDate: string;
  CheckOutDate: string;
}




export interface ReservationDto {
  Id: number;
  GuestName: string;
  RoomId: number;
  CheckInDate: string;   // ISO string من الـAPI
  CheckOutDate: string;
  IsCanceled: boolean;
  Room?: any;            // أو RoomDto بصيغة PascalCase لو رجعت من الباك
  CreatedByUserId?: number | null;
}

export type Reservation = ReservationDto;





// import { RoomDto } from './room.model';

// /** === مطابق للباكند (PascalCase) === */
// export interface ReservationDto {
//   Id: number;
//   GuestName: string;
//   RoomId: number;
//   CheckInDate: string;   // DateTime -> string
//   CheckOutDate: string;  // DateTime -> string
//   IsCanceled: boolean;
//   Room?: any;            // أو PascalCase RoomDto من الباك
// }

// export interface CreateReservationDto {
//   GuestName: string;
//   RoomId: number;
//   CheckInDate: string;
//   CheckOutDate: string;
// }

// export interface UpdateReservationDto {
//   GuestName: string;
//   CheckInDate: string;
//   CheckOutDate: string;
// }

// /** === نموذج داخلي للواجهة (camelCase) === */
// export interface Reservation {
//   id: number;
//   guestName: string;
//   roomId: number;
//   checkInDate: string;
//   checkOutDate: string;
//   isCanceled: boolean;
//   room?: RoomDto;
// }

// /** === Mappers === */
// export const toReservation = (r: ReservationDto): Reservation => ({
//   id: r.Id,
//   guestName: r.GuestName,
//   roomId: r.RoomId,
//   checkInDate: r.CheckInDate,
//   checkOutDate: r.CheckOutDate,
//   isCanceled: r.IsCanceled,
//   room: mapRoom(r.Room)
// });

// export const toApiCreate = (x: {
//   guestName: string; roomId: number; checkInDate: string; checkOutDate: string;
// }): CreateReservationDto => ({
//   GuestName: x.guestName,
//   RoomId: x.roomId,
//   CheckInDate: x.checkInDate,
//   CheckOutDate: x.checkOutDate
// });

// export const toApiUpdate = (x: {
//   guestName: string; checkInDate: string; checkOutDate: string;
// }): UpdateReservationDto => ({
//   GuestName: x.guestName,
//   CheckInDate: x.checkInDate,
//   CheckOutDate: x.checkOutDate
// });

// function mapRoom(apiRoom: any | undefined): RoomDto | undefined {
//   if (!apiRoom) return undefined;
//   if ('Id' in apiRoom) {
//     return {
//       id: apiRoom.Id,
//       roomNumber: apiRoom.RoomNumber,
//       price: apiRoom.Price,
//       capacity: apiRoom.Capacity,
//       description: apiRoom.Description,
//       isAvailable: apiRoom.IsAvailable,
//       imageUrl: apiRoom.ImageUrl ?? null
//     };
//   }
//   if ('id' in apiRoom) return apiRoom as RoomDto;
//   return undefined;
// }
