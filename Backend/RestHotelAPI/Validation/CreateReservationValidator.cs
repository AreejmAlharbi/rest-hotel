using FluentValidation;
using RestHotelAPI.Dtos;

namespace RestHotelAPI.Validation
{
    public class CreateReservationValidator:AbstractValidator<CreateReservationDto>
    {
        public CreateReservationValidator()
        {
            RuleFor(x => x.GuestName)
               .NotEmpty().WithMessage("Guest name is required")
               .MinimumLength(3).WithMessage("Guest name must be at least 3 characters");

            RuleFor(x => x.CheckInDate)
                .GreaterThanOrEqualTo(DateTime.Today)
                .WithMessage("Check-in date must be today or later");

            RuleFor(x => x.CheckOutDate)
                .GreaterThan(x => x.CheckInDate)
                .WithMessage("Check-out date must be after check-in date");

            RuleFor(x => x.RoomId)
                .GreaterThan(0).WithMessage("Room ID must be a positive number");
        }
    }
}
