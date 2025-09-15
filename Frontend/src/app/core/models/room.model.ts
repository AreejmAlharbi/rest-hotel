export interface RoomDto {
  id: number;
  roomNumber: string;
  price: number;
  capacity: number;
  description: string;
  isAvailable: boolean;
  imageUrl?: string | null;
}


// ========== UI Model (ما نستخدمه داخل القوالب) ==========
export interface Room {
  id: number;
  roomNumber: string;   // للاستخدام المباشر إذا حبّيتي تظهرينه
  name: string;         // مشتق: "Room {roomNumber}" لراحة القوالب التي تعتمد name
  description: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  imageUrl: string;     // نضمن string دائمًا (نفرغ لـ placeholder إن كان null)
}

// ========== Mapper: RoomDto -> Room ==========
export function toRoom(dto: RoomDto): Room {
  return {
    id: dto.id,
    roomNumber: dto.roomNumber,
    name: `Room ${dto.roomNumber}`,               // لو تبين اسم مختلف غيّريه هنا
    description: dto.description,
    price: dto.price,
    capacity: dto.capacity,
    isAvailable: dto.isAvailable,
    imageUrl: dto.imageUrl?.trim()
      ? dto.imageUrl!
      : 'assets/rooms/room1.jpg',                 // fallback إن كانت الصورة null
  };
}