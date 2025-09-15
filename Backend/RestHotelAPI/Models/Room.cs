namespace RestHotelAPI.Models
{
    public class Room
    {
       
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public string Capacity { get; set; } 
        public string Description { get; set; } 
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;

        public string? ImageUrl {  get; set; }

        public ICollection<Reservation>? Reservations { get; set; }
    }
}
