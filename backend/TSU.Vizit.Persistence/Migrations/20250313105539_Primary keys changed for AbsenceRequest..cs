using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PrimarykeyschangedforAbsenceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AbsenceRequest",
                table: "AbsenceRequest");

            migrationBuilder.AlterColumn<Guid>(
                name: "FinalisedById",
                table: "AbsenceRequest",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AbsenceRequest",
                table: "AbsenceRequest",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AbsenceRequest",
                table: "AbsenceRequest");

            migrationBuilder.AlterColumn<Guid>(
                name: "FinalisedById",
                table: "AbsenceRequest",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AbsenceRequest",
                table: "AbsenceRequest",
                columns: new[] { "CreatedById", "FinalisedById" });
        }
    }
}
