using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data
{
    public class PharmacyDbContext : IdentityDbContext<ApplicationUser>
    {
        public PharmacyDbContext(DbContextOptions<PharmacyDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Decimal precision
            builder.Entity<Medicine>()
                .Property(m => m.Price)
                .HasPrecision(18, 2);

            builder.Entity<Order>()
                .Property(o => o.TotalPrice)
                .HasPrecision(18, 2);

            builder.Entity<OrderItem>()
                .Property(oi => oi.TotalPrice)
                .HasPrecision(18, 2);

            builder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasPrecision(18, 2);

            // Relationships
            builder.Entity<Medicine>()
                .HasOne(m => m.Category)
                .WithMany(c => c.Medicines)
                .HasForeignKey(m => m.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Medicine)
                .WithMany(m => m.OrderItems)
                .HasForeignKey(oi => oi.MedicineId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.Entity<Medicine>()
                .HasIndex(m => m.NameAr);

            builder.Entity<Medicine>()
                .HasIndex(m => m.CategoryId);

            builder.Entity<Order>()
                .HasIndex(o => o.UserId);

            builder.Entity<Order>()
                .HasIndex(o => o.Status);

            builder.Entity<Order>()
                .HasIndex(o => o.OrderDate);
        }

    }
}