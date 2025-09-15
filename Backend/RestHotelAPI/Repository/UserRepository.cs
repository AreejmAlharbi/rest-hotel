using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RestHotelAPI.Data;
using RestHotelAPI.Dtos;
using RestHotelAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RestHotelAPI.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly HotelDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private string secretKey;
        public UserRepository( HotelDbContext dbContext, IMapper mapper, IConfiguration config)
        {
            this._dbContext = dbContext;
            this._mapper = mapper;
            _config = config;
            secretKey = _config.GetValue<string>("ApiSettings:Secret");
        }
        
        public async Task<bool> IsUserExistsAsync(string username)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Email == username);
            if (user == null)
            {

                return false; // not exists
            }

            return true;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto)
        {
                         
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == loginRequestDto.Email.ToLower());

                
                if (user == null)
                    return null;

                // cheking hashpassword
                var passwordHasher = new PasswordHasher<User>();
                var result = passwordHasher.VerifyHashedPassword(user, user.Password, loginRequestDto.Password);

                if (result == PasswordVerificationResult.Failed)
                    return null;

                
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(secretKey);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    Issuer = _config["ApiSettings:Issuer"],
                    Audience = _config["ApiSettings:Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                string jwtToken = tokenHandler.WriteToken(token);

               
                var response = new LoginResponseDto
                {
                    User = _mapper.Map<UserDto>(user),
                    Token = jwtToken
                };

                return response;
            }

        

        public async Task<UserDto> RegisterAsync(RegistrationRequestDto registrationRequestDto)
        {
            var user = _mapper.Map<User>(registrationRequestDto);

            
            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, registrationRequestDto.Password);

 
            user.Role = "user";

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }
    }
}
