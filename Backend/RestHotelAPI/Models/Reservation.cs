namespace RestHotelAPI.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string GuestName { get; set; } 
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public bool IsCanceled { get; set; } = false;


        public int RoomId { get; set; }
        public Room? Room { get; set; }

        public int? CreatedByUserId { get; set; }   // Nullable
        public User? CreatedBy { get; set; }
    }
}
