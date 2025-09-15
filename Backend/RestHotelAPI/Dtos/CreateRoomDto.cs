namespace RestHotelAPI.Dtos
{
    public class CreateRoomDto
    {
        public string RoomNumber { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public string Description { get; set; } 
        public bool IsAvailable { get; set; } = true;
    }
}
