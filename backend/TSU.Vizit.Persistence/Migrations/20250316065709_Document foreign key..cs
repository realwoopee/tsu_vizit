using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Documentforeignkey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Document",
                table: "Document");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Document",
                table: "Document",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Document_AbsenceRequestId",
                table: "Document",
                column: "AbsenceRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Document_AbsenceRequest_AbsenceRequestId",
                table: "Document",
                column: "AbsenceRequestId",
                principalTable: "AbsenceRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Document_AbsenceRequest_AbsenceRequestId",
                table: "Document");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Document",
                table: "Document");

            migrationBuilder.DropIndex(
                name: "IX_Document_AbsenceRequestId",
                table: "Document");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Document",
                table: "Document",
                column: "AbsenceRequestId");
        }
    }
}
