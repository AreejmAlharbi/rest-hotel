using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestHotelAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddReservationOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedById",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_CreatedById",
                table: "Reservations",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Users_CreatedById",
                table: "Reservations",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Users_CreatedById",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_CreatedById",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Reservations");
        }
    }
}
