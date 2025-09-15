using FluentValidation;
using RestHotelAPI.Dtos;

namespace RestHotelAPI.Validation
{
    public class UpdateReservationValidator : AbstractValidator<UpdateReservationDto>
    {
        public UpdateReservationValidator()
        {
            RuleFor(r => r.GuestName)
                .NotEmpty().WithMessage("Guest name is required.")
                .MaximumLength(100);

            RuleFor(r => r.CheckInDate)
                .LessThan(r => r.CheckOutDate)
                .WithMessage("Check-in date must be before check-out date.");

            RuleFor(r => r.CheckOutDate)
                .GreaterThan(r => r.CheckInDate)
                .WithMessage("Check-out date must be after check-in date.");
        }
    }
}
