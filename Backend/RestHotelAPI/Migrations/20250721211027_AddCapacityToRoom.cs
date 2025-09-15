using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestHotelAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCapacityToRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Rooms",
                newName: "Capacity");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Capacity",
                table: "Rooms",
                newName: "Type");
        }
    }
}
