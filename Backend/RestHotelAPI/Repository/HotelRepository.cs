using Microsoft.EntityFrameworkCore;
using RestHotelAPI.Data;
using RestHotelAPI.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace RestHotelAPI.Repository
{
    public class HotelRepository : IHotelRepository
    {
        private readonly HotelDbContext _dbContext;

        public HotelRepository(HotelDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        public async Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return await _dbContext.Rooms.ToListAsync();
        }

        public async Task<Room> AddRoomAsync(Room room)
        {
            _dbContext.Rooms.Add(room);
            await _dbContext.SaveChangesAsync();   
            return room;
        }

        public async Task<Room?> GetRoomByIdAsync(int id)
        {
            return await _dbContext.Rooms.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Room?> UpdateRoomAsync(Room room)
        {
            var existing = _dbContext.Rooms.FirstOrDefault(x => x.Id == room.Id);
            if (existing == null)
            {
                return null;
            }
            existing.RoomNumber = room.RoomNumber;
            existing.Capacity = room.Capacity;
            existing.Price = room.Price;
            existing.Description = room.Description;
            existing.IsAvailable = room.IsAvailable;

            await _dbContext.SaveChangesAsync();
            return existing;
        }

      
        public async Task<bool> DeleteRoomAsync(int id)
        {
            var room = await _dbContext.Rooms.FindAsync(id);
            if (room == null)
                return false; // bad request in endpoint step

            _dbContext.Rooms.Remove(room);
            await _dbContext.SaveChangesAsync();
            return true;

        }


       public async Task<List<Room>> GetAvailableRoomsAsync(DateTime checkIn, DateTime checkOut)
        {
            return await _dbContext.Rooms
          .Where(room => !_dbContext.Reservations.Any(res =>
              res.RoomId == room.Id &&
              !res.IsCanceled &&
              res.CheckInDate < checkOut &&
              checkIn < res.CheckOutDate))
          .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync()
        {
            return await _dbContext.Reservations
                .Include(r => r.Room).Where(r => !r.IsCanceled).ToListAsync();
        }

        public async Task<Reservation?> GetReservationByIdAsync(int id)
        {
            return await _dbContext.Reservations
                .Include(r=>r.Room)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Reservation> AddReservationAsync(Reservation reservation)
        {
            bool isRoomBooked = await _dbContext.Reservations.AnyAsync(r =>
        r.RoomId == reservation.RoomId &&
        !r.IsCanceled &&
        r.CheckInDate < reservation.CheckOutDate &&
        reservation.CheckInDate < r.CheckOutDate);

            if (isRoomBooked)
                return null;

            _dbContext.Reservations.Add(reservation);
            await _dbContext.SaveChangesAsync();
            return reservation;
        }

        public async Task<Reservation?> UpdateReservationAsync(Reservation reservation)
        {
            
            var existing = await _dbContext.Reservations.FirstOrDefaultAsync(x => x.Id == reservation.Id);
            if (existing == null)
                return null; // Not Found

            if (existing.IsCanceled)
                return null;

            if (!reservation.IsCanceled)
            {
                bool isRoomBooked = await _dbContext.Reservations.AnyAsync(r =>
                    r.Id != reservation.Id &&
                    r.RoomId == reservation.RoomId &&
                    !r.IsCanceled &&
                    r.CheckInDate < reservation.CheckOutDate &&
                    reservation.CheckInDate < r.CheckOutDate);

                if (isRoomBooked)
                    return null; // Conflict , room already booked
            }

            existing.GuestName = reservation.GuestName;
            existing.CheckInDate = reservation.CheckInDate;
            existing.CheckOutDate = reservation.CheckOutDate;
            existing.RoomId = reservation.RoomId;

            //PATCH 
            existing.IsCanceled = reservation.IsCanceled;

            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> CancelReservationAsync(int id)
        {
            var reservation = await _dbContext.Reservations.FirstOrDefaultAsync(r => r.Id == id);
            if (reservation == null || reservation.IsCanceled)
                return false;//badRequest

            reservation.IsCanceled = true;
            await _dbContext.SaveChangesAsync();
            return true;//Canceld 200 OK
        }

        public async Task<IEnumerable<Reservation>> GetCanceledReservationsAsync()
        {
            return await _dbContext.Reservations
                .Include(r => r.Room)
                .Where(r => r.IsCanceled)
                .ToListAsync();
        }

        public async Task<List<Reservation>> GetReservationsByUserAsync(int userId)
        {
            return await _dbContext.Reservations
        .Include(r => r.Room)
        .Where(r => r.CreatedByUserId == userId)
        .OrderByDescending(r => r.Id)
        .ToListAsync();

        }
    }
}
