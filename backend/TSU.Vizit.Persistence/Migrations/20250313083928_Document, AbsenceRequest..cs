using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DocumentAbsenceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbsenceRequests_Users_CreatedById",
                table: "AbsenceRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_AbsenceRequests_Users_FinalisedById",
                table: "AbsenceRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Document_AbsenceRequests_AbsenceRequestId",
                table: "Document");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Document",
                table: "Document");

            migrationBuilder.DropIndex(
                name: "IX_Document_AbsenceRequestId",
                table: "Document");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AbsenceRequests",
                table: "AbsenceRequests");

            migrationBuilder.DropIndex(
                name: "IX_AbsenceRequests_CreatedById",
                table: "AbsenceRequests");

            migrationBuilder.DropIndex(
                name: "IX_AbsenceRequests_FinalisedById",
                table: "AbsenceRequests");

            migrationBuilder.RenameTable(
                name: "AbsenceRequests",
                newName: "AbsenceRequest");

            migrationBuilder.AddColumn<byte[]>(
                name: "Attachment",
                table: "Document",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);

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
                name: "PK_Document",
                table: "Document",
                column: "AbsenceRequestId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AbsenceRequest",
                table: "AbsenceRequest",
                columns: new[] { "CreatedById", "FinalisedById" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Document",
                table: "Document");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AbsenceRequest",
                table: "AbsenceRequest");

            migrationBuilder.DropColumn(
                name: "Attachment",
                table: "Document");

            migrationBuilder.RenameTable(
                name: "AbsenceRequest",
                newName: "AbsenceRequests");

            migrationBuilder.AlterColumn<Guid>(
                name: "FinalisedById",
                table: "AbsenceRequests",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Document",
                table: "Document",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AbsenceRequests",
                table: "AbsenceRequests",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Document_AbsenceRequestId",
                table: "Document",
                column: "AbsenceRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_AbsenceRequests_CreatedById",
                table: "AbsenceRequests",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AbsenceRequests_FinalisedById",
                table: "AbsenceRequests",
                column: "FinalisedById");

            migrationBuilder.AddForeignKey(
                name: "FK_AbsenceRequests_Users_CreatedById",
                table: "AbsenceRequests",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AbsenceRequests_Users_FinalisedById",
                table: "AbsenceRequests",
                column: "FinalisedById",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Document_AbsenceRequests_AbsenceRequestId",
                table: "Document",
                column: "AbsenceRequestId",
                principalTable: "AbsenceRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
