using Azure;
using FluentValidation;
using RestHotelAPI.Dtos;
using RestHotelAPI.Repository;

namespace RestHotelAPI.Endpoints
{
    public static class AuthEndpoints
    {

        //public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
        //{
        //    group.MapPost("/users/register", async (
        //        RegistrationRequestDto registrationRequestDto,
        //        IUserRepository repository,
        //        IValidator<RegistrationRequestDto> validator) =>
        //    {
        //        if (await repository.IsUserExistsAsync(registrationRequestDto.Email))
        //            return Results.BadRequest("User already exists.");

        //        var validationResult = await validator.ValidateAsync(registrationRequestDto);

        //        if (string.IsNullOrWhiteSpace(registrationRequestDto.Email) &&
        //            string.IsNullOrWhiteSpace(registrationRequestDto.FullName) &&
        //            string.IsNullOrWhiteSpace(registrationRequestDto.Password))
        //        {
        //            throw new ArgumentException("All fields are required.");
        //        }

        //        if (!validationResult.IsValid)
        //            return Results.BadRequest(validationResult.Errors.FirstOrDefault()?.ToString());

        //        var result = await repository.RegisterAsync(registrationRequestDto);
        //        return Results.Ok(result);
        //    })
        //    .AllowAnonymous(); // 👈 مهم

        //    group.MapPost("/users/login", async (
        //        LoginRequestDto loginDto,
        //        IUserRepository repository) =>
        //    {
        //        var result = await repository.LoginAsync(loginDto);
        //        if (result == null)
        //            return Results.BadRequest("Invalid username or password.");
        //        return Results.Ok(result);
        //    })
        //    .AllowAnonymous(); // 👈 مهم/

        //    return group;
        //}




         public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
         {
             app.MapPost("/api/users/register", async (RegistrationRequestDto registrationRequestDto,IUserRepository repository, IValidator<RegistrationRequestDto> validator) =>
             {
                 if (await repository.IsUserExistsAsync(registrationRequestDto.Email))
                     return Results.BadRequest("User already exists.");

                 var validationResult = await validator.ValidateAsync(registrationRequestDto);

                 if (string.IsNullOrWhiteSpace(registrationRequestDto.Email) &&
                 string.IsNullOrWhiteSpace(registrationRequestDto.FullName) &&
                 string.IsNullOrWhiteSpace(registrationRequestDto.Password))
                 {
                     throw new ArgumentException("All fields are required.");
                 }

                 if (!validationResult.IsValid)
                     return Results.BadRequest(validationResult.Errors.FirstOrDefault().ToString());


                 var result = await repository.RegisterAsync(registrationRequestDto);
                 return Results.Ok(result);
             }).AllowAnonymous(); ;

             app.MapPost("/api/users/login", async (LoginRequestDto loginDto, IUserRepository repository) =>
             {
                 var result = await repository.LoginAsync(loginDto);
                 if (result == null)
                     return Results.BadRequest("Invalid username or password.");

                 return Results.Ok(result);
             }).AllowAnonymous(); ;

         }

    }
}
