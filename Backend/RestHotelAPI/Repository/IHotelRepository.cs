using RestHotelAPI.Models;

namespace RestHotelAPI.Repository
{
    public interface IHotelRepository
    {
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task<Room?> GetRoomByIdAsync(int id);
        Task<Room> AddRoomAsync(Room room);
        Task<Room?> UpdateRoomAsync(Room room);
        Task<bool> DeleteRoomAsync(int id);
        Task<List<Room>> GetAvailableRoomsAsync(DateTime checkIn, DateTime checkOut);

        Task<IEnumerable<Reservation>> GetAllReservationsAsync();
        Task<Reservation?> GetReservationByIdAsync(int id);
        Task<Reservation> AddReservationAsync(Reservation reservation);

        Task<Reservation?> UpdateReservationAsync(Reservation reservation);
        Task<bool> CancelReservationAsync(int id);

        Task<IEnumerable<Reservation>> GetCanceledReservationsAsync();

        Task<List<Reservation>> GetReservationsByUserAsync(int userId);


    }
}
