namespace RestHotelAPI.Dtos
{
    public class UpdateReservationDto
    {
        public string GuestName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
    }
}
