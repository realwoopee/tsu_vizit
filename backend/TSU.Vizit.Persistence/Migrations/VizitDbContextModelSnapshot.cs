﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;
using TSU.Vizit.Persistence;

#nullable disable

namespace TSU.Vizit.Persistence.Migrations
{
    [DbContext(typeof(VizitDbContext))]
    partial class VizitDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.HasPostgresEnum(modelBuilder, "absence_reason", new[] { "personal", "family", "sick" });
            NpgsqlModelBuilderExtensions.HasPostgresEnum(modelBuilder, "absence_request_result", new[] { "unknown", "approved", "declined" });
            NpgsqlModelBuilderExtensions.HasPostgresEnum(modelBuilder, "user_role", new[] { "student", "teacher", "deans_employee", "admin" });
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("TSU.Vizit.Domain.AbsenceRequest", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateOnly>("AbsencePeriodFinish")
                        .HasColumnType("date");

                    b.Property<DateOnly>("AbsencePeriodStart")
                        .HasColumnType("date");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<AbsenceRequestResult?>("FinalStatus")
                        .HasColumnType("absence_request_result");

                    b.Property<Guid?>("FinalisedById")
                        .HasColumnType("uuid");

                    b.Property<AbsenceReason>("Reason")
                        .HasColumnType("absence_reason");

                    b.Property<DateTime>("TimeCreated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("TimeFinalised")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("CreatedById");

                    b.ToTable("AbsenceRequest");
                });

            modelBuilder.Entity("TSU.Vizit.Domain.Document", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("AbsenceRequestId")
                        .HasColumnType("uuid");

                    b.Property<byte[]>("Attachment")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("AbsenceRequestId");

                    b.ToTable("Document");
                });

            modelBuilder.Entity("TSU.Vizit.Domain.Users.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("MustChangePassword")
                        .HasColumnType("boolean");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("StudentIdNumber")
                        .HasColumnType("text");

                    b.Property<UserRole>("UserRole")
                        .HasColumnType("user_role");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("StudentIdNumber")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TSU.Vizit.Domain.AbsenceRequest", b =>
                {
                    b.HasOne("TSU.Vizit.Domain.Users.User", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CreatedBy");
                });

            modelBuilder.Entity("TSU.Vizit.Domain.Document", b =>
                {
                    b.HasOne("TSU.Vizit.Domain.AbsenceRequest", null)
                        .WithMany("Attachments")
                        .HasForeignKey("AbsenceRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TSU.Vizit.Domain.AbsenceRequest", b =>
                {
                    b.Navigation("Attachments");
                });
#pragma warning restore 612, 618
        }
    }
}
