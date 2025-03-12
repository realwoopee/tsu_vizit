using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Userroleisnowproperenum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
    {
        // 1. Create the enum type
        migrationBuilder.Sql("CREATE TYPE user_role AS ENUM ('Student', 'Teacher', 'DeansWorker', 'Admin')");

        // 2. Add a temporary column
        migrationBuilder.AddColumn<string>(
            name: "RoleTemp",
            table: "Users",
            type: "user_role",
            nullable: true);

        // 3. Convert existing data
        migrationBuilder.Sql(@"
            UPDATE ""Users""
            SET ""RoleTemp"" = CASE ""Role""
                WHEN 0 THEN 'Student'::user_role
                WHEN 1 THEN 'Teacher'::user_role
                WHEN 2 THEN 'DeansWorker'::user_role
                WHEN 3 THEN 'Admin'::user_role
            END");

        // 4. Drop the old column
        migrationBuilder.DropColumn(
            name: "Role",
            table: "Users");

        // 5. Rename the temporary column
        migrationBuilder.RenameColumn(
            name: "RoleTemp",
            table: "Users",
            newName: "Role");

        // 6. Set the new column as not nullable
        migrationBuilder.AlterColumn<string>(
            name: "Role",
            table: "Users",
            type: "user_role",
            nullable: false);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // 1. Add a temporary integer column
        migrationBuilder.AddColumn<int>(
            name: "RoleTemp",
            table: "Users",
            type: "integer",
            nullable: false,
            defaultValue: 0);

        // 2. Convert data back to integers
        migrationBuilder.Sql(@"
            UPDATE ""Users""
            SET ""RoleTemp"" = CASE ""Role""::text
                WHEN 'Student' THEN 0
                WHEN 'Teacher' THEN 1
                WHEN 'DeansWorker' THEN 2
                WHEN 'Admin' THEN 3
            END");

        // 3. Drop the enum column
        migrationBuilder.DropColumn(
            name: "Role",
            table: "Users");

        // 4. Rename the temporary column
        migrationBuilder.RenameColumn(
            name: "RoleTemp",
            table: "Users",
            newName: "Role");

        // 5. Drop the enum type
        migrationBuilder.Sql("DROP TYPE user_role");
    }
    }
}
