namespace RestHotelAPI.Dtos
{
    public class RoomDto //client and admin
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public decimal Price { get; set; }
        public int Capacity {  get; set; }

        public string Description { get; set; }
        public bool IsAvailable { get; set; } = true;

        public string? ImageUrl { get; set; }

    }
}
