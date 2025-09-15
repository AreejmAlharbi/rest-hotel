using System.ComponentModel.DataAnnotations;

namespace RestHotelAPI.Dtos
{
    public class RegistrationRequestDto
    {
        public string FullName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

       [MinLength(6)]
        public string Password { get; set; } 
        
        //role will be added later in code
        
        
    }
}
