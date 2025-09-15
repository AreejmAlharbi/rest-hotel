using AutoMapper;
using RestHotelAPI.Dtos;
using RestHotelAPI.Models;

namespace RestHotelAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        
        { 
            CreateMap<Room,RoomDto>().ReverseMap();
            CreateMap<Room, CreateRoomDto>().ReverseMap();
            CreateMap<Room, UpdateRoomDto>().ReverseMap();
            CreateMap<Room, ClientRoomDto>(); // only response for client

            //CreateMap<Reservation, ReservationDto>().ReverseMap();
            CreateMap<Reservation, CreateReservationDto>().ReverseMap();
            CreateMap<Reservation, UpdateReservationDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, RegistrationRequestDto>().ReverseMap(); //role must be added separatly

            CreateMap<Reservation, ReservationDto>()
            .ForMember(d => d.CreatedByUserId, o => o.MapFrom(s => s.CreatedByUserId));



        }
    }
}
