using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Titlepropertyaddedfordocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Document",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Document");
        }
    }
}
