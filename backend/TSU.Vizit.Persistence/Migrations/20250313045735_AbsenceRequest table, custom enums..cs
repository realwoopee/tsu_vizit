using System;
using Microsoft.EntityFrameworkCore.Migrations;
using TSU.Vizit.Domain;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AbsenceRequesttablecustomenums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:absence_reason", "personal,family,sick")
                .Annotation("Npgsql:Enum:absence_request_result", "unknown,approved,declined")
                .Annotation("Npgsql:Enum:user_role", "student,teacher,deans_employee,admin")
                .OldAnnotation("Npgsql:Enum:user_role", "student,teacher,deans_employee,admin");

            migrationBuilder.CreateTable(
                name: "AbsenceRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TimeCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimeFinalised = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    FinalisedById = table.Column<Guid>(type: "uuid", nullable: true),
                    FinalStatus = table.Column<AbsenceRequestResult>(type: "absence_request_result", nullable: true),
                    Reason = table.Column<AbsenceReason>(type: "absence_reason", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbsenceRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbsenceRequests_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AbsenceRequests_Users_FinalisedById",
                        column: x => x.FinalisedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Document",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AbsenceRequestId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Document", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Document_AbsenceRequests_AbsenceRequestId",
                        column: x => x.AbsenceRequestId,
                        principalTable: "AbsenceRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AbsenceRequests_CreatedById",
                table: "AbsenceRequests",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AbsenceRequests_FinalisedById",
                table: "AbsenceRequests",
                column: "FinalisedById");

            migrationBuilder.CreateIndex(
                name: "IX_Document_AbsenceRequestId",
                table: "Document",
                column: "AbsenceRequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Document");

            migrationBuilder.DropTable(
                name: "AbsenceRequests");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:user_role", "student,teacher,deans_employee,admin")
                .OldAnnotation("Npgsql:Enum:absence_reason", "personal,family,sick")
                .OldAnnotation("Npgsql:Enum:absence_request_result", "unknown,approved,declined")
                .OldAnnotation("Npgsql:Enum:user_role", "student,teacher,deans_employee,admin");
        }
    }
}
