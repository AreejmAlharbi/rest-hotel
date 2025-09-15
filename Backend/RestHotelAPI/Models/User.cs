using System.ComponentModel.DataAnnotations;

namespace RestHotelAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }  

        [Required]
        public string Role { get; set; } 
    }
}
