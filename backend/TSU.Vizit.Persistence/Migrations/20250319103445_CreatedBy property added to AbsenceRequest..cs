using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreatedBypropertyaddedtoAbsenceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AbsenceRequest_CreatedById",
                table: "AbsenceRequest",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_AbsenceRequest_Users_CreatedById",
                table: "AbsenceRequest",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbsenceRequest_Users_CreatedById",
                table: "AbsenceRequest");

            migrationBuilder.DropIndex(
                name: "IX_AbsenceRequest_CreatedById",
                table: "AbsenceRequest");
        }
    }
}
