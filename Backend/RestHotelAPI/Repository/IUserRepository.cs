using RestHotelAPI.Dtos;
using RestHotelAPI.Models;

namespace RestHotelAPI.Repository
{
    public interface IUserRepository
    {
        Task<UserDto> RegisterAsync(RegistrationRequestDto registrationRequestDto);
        Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto);
        Task<bool> IsUserExistsAsync(string email);
    }
}
