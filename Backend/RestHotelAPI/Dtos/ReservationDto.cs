namespace RestHotelAPI.Dtos
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public string GuestName { get; set; } = string.Empty;
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public bool IsCanceled { get; set; }
        public RoomDto? Room { get; set; }

        public int? CreatedByUserId { get; set; }   
        public UserDto? CreatedBy { get; set; }
    }
}
