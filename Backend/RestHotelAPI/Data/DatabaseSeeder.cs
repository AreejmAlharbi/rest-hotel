using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RestHotelAPI.Models;

namespace RestHotelAPI.Data
{
    public class DatabaseSeeder
    {

        public static void SeedAdmin(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<HotelDbContext>();

            db.Database.Migrate(); // تأكد من وجود القاعدة

            if (!db.Users.Any(u => u.Email == "admin@gmail.com"))
            {
                var hasher = new PasswordHasher<User>();
                var admin = new User
                {
                    Email = "admin@gmail.com",
                    FullName = "Areej Alharbi - Admin",
                    Role = "admin",
                };
                admin.Password = hasher.HashPassword(admin, "123456");
                db.Users.Add(admin);
                db.SaveChanges();
            }
        }
    }
}
