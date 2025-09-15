using FluentValidation;
using RestHotelAPI.Dtos;

namespace RestHotelAPI.Validation
{
    public class UpdateRoomValidator : AbstractValidator<UpdateRoomDto>
    {
        public UpdateRoomValidator()
        {
            RuleFor(x => x.RoomNumber)
               .NotEmpty().WithMessage("Room number is required")
               .MinimumLength(1).WithMessage("Room number must be at least 1 character");

            RuleFor(x => x.Capacity)
                .GreaterThan(0).WithMessage("Capacity must be greater than 0");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0");
        }
    }
}
