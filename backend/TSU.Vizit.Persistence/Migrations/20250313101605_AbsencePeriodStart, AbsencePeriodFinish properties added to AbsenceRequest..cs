using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AbsencePeriodStartAbsencePeriodFinishpropertiesaddedtoAbsenceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AbsencePeriodFinish",
                table: "AbsenceRequest",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "AbsencePeriodStart",
                table: "AbsenceRequest",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AbsencePeriodFinish",
                table: "AbsenceRequest");

            migrationBuilder.DropColumn(
                name: "AbsencePeriodStart",
                table: "AbsenceRequest");
        }
    }
}
