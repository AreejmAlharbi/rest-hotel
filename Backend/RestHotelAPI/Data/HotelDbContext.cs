using Microsoft.EntityFrameworkCore;
using RestHotelAPI.Models;

namespace RestHotelAPI.Data
{
    public class HotelDbContext:DbContext
    {

        public HotelDbContext(DbContextOptions<HotelDbContext> options) :base(options)
        {   
        }
        public DbSet<Room> Rooms {  get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Reservation> Reservations { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Reservation>()
               .HasOne(r => r.CreatedBy)
               .WithMany()
               .HasForeignKey(r => r.CreatedByUserId)
               .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Reservation>()
               .Property(r => r.CheckInDate).HasColumnType("date");
            modelBuilder.Entity<Reservation>()
                .Property(r => r.CheckOutDate).HasColumnType("date");

        }   

        }
}
