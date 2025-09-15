using System.ComponentModel.DataAnnotations;

namespace RestHotelAPI.Dtos
{
    public class LoginRequestDto
    {
        [EmailAddress]
        public string Email { get; set; }

        [MinLength(6)]
        public string Password { get; set; } 

    }
}
