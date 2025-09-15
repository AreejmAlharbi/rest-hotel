using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using RestHotelAPI.Dtos;
using RestHotelAPI.Models;
using RestHotelAPI.Repository;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace RestHotelAPI.Endpoints
{
    public static class RoomEndpoints
    {
        public static void MapRoomEndpoints(this IEndpointRouteBuilder app)
        {
                
            app.MapGet("/api/rooms", async (IHotelRepository repository, IMapper mapper) =>
            {
                var rooms = await repository.GetAllRoomsAsync();
                var result = mapper.Map<List<RoomDto>>(rooms);
                return Results.Ok(result);
            });

            app.MapGet("/api/rooms/{id:int}", async (int id, IHotelRepository repository, IMapper mapper) =>
            {
                var room = await repository.GetRoomByIdAsync(id);
                if (room is null)
                    return Results.NotFound();

                var result = mapper.Map<RoomDto>(room);
                return Results.Ok(result);
            });


            app.MapPost("/api/rooms", async (HttpRequest request, IValidator<CreateRoomDto> validator,IMapper mapper
                    , IHotelRepository repository,IImageService imageService) =>
            {
                var form = await request.ReadFormAsync();

                var createRoomDto = new CreateRoomDto
                {
                    RoomNumber = form["roomNumber"],
                    Price = decimal.Parse(form["price"]),
                    Capacity = int.Parse(form["capacity"]),
                    Description = form["description"]
                };

                var validationResult = await validator.ValidateAsync(createRoomDto);
                if (!validationResult.IsValid)
                    return Results.BadRequest(validationResult.Errors);

                var file = form.Files.GetFile("image");
                string imageUrl = null;
                if (file != null)
                {
                    imageUrl = await imageService.UploadImageAsync(file);
                }

                var room = mapper.Map<Room>(createRoomDto);
                room.ImageUrl = imageUrl;

                var addedRoom = await repository.AddRoomAsync(room);
                var resultDto = mapper.Map<RoomDto>(addedRoom);

                return Results.Created($"/api/rooms/{resultDto.Id}", resultDto);
            }).Accepts<IFormFile>("multipart/form-data").RequireAuthorization("admin");






            //app.MapPost("/api/rooms", async (CreateRoomDto createRoomDto, IValidator<CreateRoomDto> validator,
            //IMapper mapper,
            //IHotelRepository repository, HttpRequest request, IImageService imageService) =>
            //{
            //    var validationResult = await validator.ValidateAsync(createRoomDto);
            //    if (!validationResult.IsValid)
            //        return Results.BadRequest(validationResult.Errors);

            //    var form = await request.ReadFormAsync();

            //    createRoomDto.RoomNumber = form["roomNumber"];
            //    createRoomDto.Price = decimal.Parse(form["price"]);
            //    createRoomDto.Capacity = int.Parse(form["capacity"]);
            //    createRoomDto.Description = form["description"];

            //    //var room = mapper.Map<Room>(createRoomDto);

            //      string imageUrl = null;

            //    var file = form.Files.GetFile("image");
            //    if (file != null)
            //    {
            //        imageUrl = await imageService.UploadImageAsync(file);
            //    }

            //    var room = mapper.Map<Room>(createRoomDto);
            //    room.ImageUrl = imageUrl;
            //    var addedRoom = await repository.AddRoomAsync(room);

            //    var resultDto = mapper.Map<RoomDto>(addedRoom);

            //    return Results.Created($"/api/rooms/{resultDto.Id}", resultDto);
            //}).Accepts<IFormFile>("multipart/form-data").RequireAuthorization("admin");





            //app.MapPut("/api/rooms/{id:int}", async (int id,UpdateRoomDto updateRoomDto
            //    ,IHotelRepository repository,IMapper mapper
            //    ,IValidator<UpdateRoomDto> validator) =>
            //{
            //    var validationResult = await validator.ValidateAsync(updateRoomDto);
            //    if (!validationResult.IsValid)
            //        return Results.BadRequest(validationResult.Errors);

            //    var existingRoom = await repository.GetRoomByIdAsync(id);
            //    if (existingRoom is null)
            //        return Results.NotFound($"Room with ID {id} not found.");

            //    mapper.Map(updateRoomDto, existingRoom); //source - distanation
            //    await repository.UpdateRoomAsync(existingRoom);

            //    var result = mapper.Map<RoomDto>(existingRoom);

            //    return Results.Ok( result);
            //}).RequireAuthorization("admin");



            app.MapPut("/api/rooms/{id:int}", async (int id,HttpRequest request,IHotelRepository repository
                ,IMapper mapper,IImageService imageService,IValidator<UpdateRoomDto> validator) =>
            {
                var form = await request.ReadFormAsync();

                var updateRoomDto = new UpdateRoomDto
                {
                    RoomNumber = form["roomNumber"],
                    Price = decimal.Parse(form["price"]),
                    Capacity = int.Parse(form["capacity"]),
                    Description = form["description"]
                };

                var validationResult = await validator.ValidateAsync(updateRoomDto);
                if (!validationResult.IsValid)
                    return Results.BadRequest(validationResult.Errors);

                var existingRoom = await repository.GetRoomByIdAsync(id);
                if (existingRoom is null)
                    return Results.NotFound($"Room with ID {id} not found.");

               
                var file = form.Files.GetFile("image");
                if (file != null)
                {
                    var newImageUrl = await imageService.UploadImageAsync(file);
                    existingRoom.ImageUrl = newImageUrl;
                }


                mapper.Map(updateRoomDto, existingRoom);
                await repository.UpdateRoomAsync(existingRoom);

                var result = mapper.Map<RoomDto>(existingRoom);
                return Results.Ok(result);
            }).Accepts<IFormFile>("multipart/form-data").RequireAuthorization("admin");




            //app.MapDelete("/api/rooms/{id}", async (int id, IHotelRepository repository) =>
            //{
            //    bool deleted = await repository.DeleteRoomAsync(id);

            //    if (!deleted)
            //        return Results.NotFound($"Room with ID {id} was not found.");

            //    return Results.Ok($"Room with ID {id} deleted successfully.");
            //}).RequireAuthorization("admin");


            app.MapDelete("/api/rooms/{id}", async (int id, IHotelRepository repository, IImageService imageService) =>
            {
                var room = await repository.GetRoomByIdAsync(id);
                if (room == null)
                    return Results.NotFound($"Room with ID {id} was not found.");

                if (!string.IsNullOrEmpty(room.ImageUrl))
                    await imageService.DeleteImageAsync(room.ImageUrl); 

                bool deleted = await repository.DeleteRoomAsync(id);
                return Results.Ok($"Room with ID {id} deleted successfully.");
            }).RequireAuthorization("admin");


            //filtring rooms
            app.MapGet("/api/rooms/available", async (DateTime checkIn, DateTime checkOut,IHotelRepository repository,IMapper mapper) =>
            {
                if (checkIn >= checkOut)
                    return Results.BadRequest("Check-out date must be after check-in date.");

                var availableRooms = await repository.GetAvailableRoomsAsync(checkIn, checkOut);
                var availableRoomsDto = mapper.Map<List<RoomDto>>(availableRooms);

                return Results.Ok(availableRoomsDto);
            });



            //app.MapPost("/api/reservations", async (CreateReservationDto createReservationDto, IValidator<CreateReservationDto> validator,
            //    IMapper mapper,
            //    IHotelRepository repository) =>
            //{
            //    var validationResult = await validator.ValidateAsync(createReservationDto);
            //    if (!validationResult.IsValid)
            //        return Results.BadRequest(validationResult.Errors);

            //    var reservation = mapper.Map<Reservation>(createReservationDto);
            //    var result = await repository.AddReservationAsync(reservation);


            //    if (result == null)
            //        return Results.BadRequest("The room is already booked for the selected period.");

            //    return Results.Created($"/api/reservations/{result.Id}", mapper.Map<ReservationDto>(result));
            //});



                app.MapPost("/api/reservations", [Authorize] async (HttpContext http, CreateReservationDto createReservationDto, 
                    IValidator<CreateReservationDto> validator, IMapper mapper,IHotelRepository repository) =>
                {
                    var validationResult = await validator.ValidateAsync(createReservationDto);
                    if (!validationResult.IsValid)
                        return Results.BadRequest(validationResult.Errors);

                    var reservation = mapper.Map<Reservation>(createReservationDto);

                    // match current user with his reservation
                    var uidStr = http.User.FindFirstValue(ClaimTypes.NameIdentifier)
                               ?? http.User.FindFirstValue("sub");
                    if (int.TryParse(uidStr, out var uid))
                        reservation.CreatedByUserId = uid;

                    var result = await repository.AddReservationAsync(reservation);

                    if (result == null)
                        return Results.BadRequest("The room is already booked for the selected period.");

                    return Results.Created($"/api/reservations/{result.Id}", mapper.Map<ReservationDto>(result));
                });



            app.MapGet("/api/reservations", async (IHotelRepository repository, IMapper mapper) =>
            {
                var reservations = await repository.GetAllReservationsAsync();
                var result = mapper.Map<List<ReservationDto>>(reservations);
                return Results.Ok(result);
            });


            app.MapGet("/api/reservations/{id}", async (int id, IHotelRepository repository, IMapper mapper) =>
            {
                var reservation = await repository.GetReservationByIdAsync(id);
                if (reservation == null)
                    return Results.NotFound($"Reservation with ID {id} was not found.");

                return Results.Ok(mapper.Map<ReservationDto>(reservation));
            });

            app.MapPut("/api/reservations/{id}", async ( int id, UpdateReservationDto updateDto,
                IHotelRepository repository, IMapper mapper, IValidator<UpdateReservationDto> validator) =>
            {
                var validationResult = await validator.ValidateAsync(updateDto);
                if (!validationResult.IsValid)
                    return Results.BadRequest(validationResult.Errors);

                
                var existingReservation = await repository.GetReservationByIdAsync(id);
                if (existingReservation is null)
                    return Results.NotFound($"Reservation with ID {id} was not found.");

              
                mapper.Map(updateDto, existingReservation);

                
                var updatedReservation = await repository.UpdateReservationAsync(existingReservation);
                if (updatedReservation == null)
                    return Results.BadRequest("Update failed. Room may be already booked, or reservation not found.");



                return Results.Ok(mapper.Map<ReservationDto>(updatedReservation));
            });

            app.MapPatch("/api/reservations/{id}/cancel", async (int id, IHotelRepository repository) =>
            {
                var result = await repository.CancelReservationAsync(id);
                if (!result)
                    return Results.BadRequest($"Reservation with ID {id} not found or already canceled.");

                return Results.Ok($"Reservation with ID {id} has been canceled.");
            });

            app.MapGet("/api/reservations/canceled", async (IHotelRepository repository, IMapper mapper) =>
            {
                var canceledReservations = await repository.GetCanceledReservationsAsync();

                return Results.Ok(mapper.Map<List<ReservationDto>>(canceledReservations));
            });

            app.MapGet("/api/reservations/mine",
            [Authorize] async (HttpContext http, IHotelRepository repo, IMapper mapper) =>
            {
                var uidStr = http.User.FindFirstValue(ClaimTypes.NameIdentifier)
                             ?? http.User.FindFirstValue("sub");
                if (!int.TryParse(uidStr, out var uid)) return Results.Unauthorized();

                var list = await repo.GetReservationsByUserAsync(uid);
                return Results.Ok(mapper.Map<IEnumerable<ReservationDto>>(list));
            });




        }
    }
}
