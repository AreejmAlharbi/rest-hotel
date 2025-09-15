using FluentValidation;
using RestHotelAPI.Dtos;

namespace RestHotelAPI.Validation
{
    public class RegistrationRequestValidator:AbstractValidator<RegistrationRequestDto>
    {
        public RegistrationRequestValidator()
        {
            RuleFor(x => x.FullName)
              .NotEmpty().WithMessage("Full name is required")
              .MinimumLength(3).WithMessage("Full name must be at least 3 characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(4).WithMessage("Password must be at least 4 characters");
        }
    }
}
