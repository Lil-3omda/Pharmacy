using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Entities;

namespace Pharmacy.Infrastructure.Data
{
    public static class SeedData
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Admin", "Pharmacist", "Customer" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        public static async Task SeedUsersAsync(UserManager<ApplicationUser> userManager)
        {
            // Admin user
            var adminUser = await userManager.FindByEmailAsync("admin@pharmacy.sa");
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "admin@pharmacy.sa",
                    Email = "admin@pharmacy.sa",
                    FullName = "مدير النظام",
                    Role = "Admin",
                    EmailConfirmed = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Pharmacist user
            var pharmacistUser = await userManager.FindByEmailAsync("pharmacist@pharmacy.sa");
            if (pharmacistUser == null)
            {
                pharmacistUser = new ApplicationUser
                {
                    UserName = "pharmacist@pharmacy.sa",
                    Email = "pharmacist@pharmacy.sa",
                    FullName = "صيدلي",
                    Role = "Pharmacist",
                    EmailConfirmed = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(pharmacistUser, "Pharma123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(pharmacistUser, "Pharmacist");
                }
            }

            // Customer user
            var customerUser = await userManager.FindByEmailAsync("customer@pharmacy.sa");
            if (customerUser == null)
            {
                customerUser = new ApplicationUser
                {
                    UserName = "customer@pharmacy.sa",
                    Email = "customer@pharmacy.sa",
                    FullName = "عميل",
                    Role = "Customer",
                    EmailConfirmed = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(customerUser, "Customer123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(customerUser, "Customer");
                }
            }
        }

        public static async Task SeedCategoriesAsync(PharmacyDbContext context)
        {
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category
                    {
                        NameAr = "مضادات حيوية",
                        NameEn = "Antibiotics",
                        DescriptionAr = "أدوية لعلاج الالتهابات البكتيرية",
                        DescriptionEn = "Medications for treating bacterial infections",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Category
                    {
                        NameAr = "مسكنات الألم",
                        NameEn = "Painkillers",
                        DescriptionAr = "أدوية لتخفيف الألم",
                        DescriptionEn = "Medications for pain relief",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Category
                    {
                        NameAr = "فيتامينات",
                        NameEn = "Vitamins",
                        DescriptionAr = "مكملات غذائية وفيتامينات",
                        DescriptionEn = "Nutritional supplements and vitamins",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Category
                    {
                        NameAr = "مستحضرات تجميل",
                        NameEn = "Cosmetics",
                        DescriptionAr = "منتجات العناية بالبشرة والشعر",
                        DescriptionEn = "Skin and hair care products",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Category
                    {
                        NameAr = "أدوية القلب",
                        NameEn = "Cardiovascular",
                        DescriptionAr = "أدوية لعلاج أمراض القلب والشرايين",
                        DescriptionEn = "Medications for heart and cardiovascular diseases",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }
        }

        public static async Task SeedMedicinesAsync(PharmacyDbContext context)
        {
            if (!context.Medicines.Any())
            {
                var categories = await context.Categories.ToListAsync();
                
                var medicines = new List<Medicine>
                {
                    // Antibiotics
                    new Medicine
                    {
                        NameAr = "أموكسيسيلين",
                        NameEn = "Amoxicillin",
                        DescriptionAr = "مضاد حيوي واسع الطيف",
                        DescriptionEn = "Broad-spectrum antibiotic",
                        CategoryId = categories.First(c => c.NameAr == "مضادات حيوية").Id,
                        Price = 25.50m,
                        Stock = 100,
                        ExpiryDate = DateTime.UtcNow.AddYears(2),
                        ImageUrl = "https://example.com/amoxicillin.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Medicine
                    {
                        NameAr = "أزيثروميسين",
                        NameEn = "Azithromycin",
                        DescriptionAr = "مضاد حيوي لعلاج التهابات الجهاز التنفسي",
                        DescriptionEn = "Antibiotic for respiratory infections",
                        CategoryId = categories.First(c => c.NameAr == "مضادات حيوية").Id,
                        Price = 45.75m,
                        Stock = 75,
                        ExpiryDate = DateTime.UtcNow.AddYears(2),
                        ImageUrl = "https://example.com/azithromycin.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    
                    // Painkillers
                    new Medicine
                    {
                        NameAr = "باراسيتامول",
                        NameEn = "Paracetamol",
                        DescriptionAr = "مسكن للألم وخافض للحرارة",
                        DescriptionEn = "Pain reliever and fever reducer",
                        CategoryId = categories.First(c => c.NameAr == "مسكنات الألم").Id,
                        Price = 15.25m,
                        Stock = 200,
                        ExpiryDate = DateTime.UtcNow.AddYears(3),
                        ImageUrl = "https://example.com/paracetamol.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Medicine
                    {
                        NameAr = "إيبوبروفين",
                        NameEn = "Ibuprofen",
                        DescriptionAr = "مسكن للألم ومضاد للالتهاب",
                        DescriptionEn = "Pain reliever and anti-inflammatory",
                        CategoryId = categories.First(c => c.NameAr == "مسكنات الألم").Id,
                        Price = 18.50m,
                        Stock = 150,
                        ExpiryDate = DateTime.UtcNow.AddYears(3),
                        ImageUrl = "https://example.com/ibuprofen.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    
                    // Vitamins
                    new Medicine
                    {
                        NameAr = "فيتامين سي",
                        NameEn = "Vitamin C",
                        DescriptionAr = "مكمل غذائي لتقوية المناعة",
                        DescriptionEn = "Nutritional supplement for immune support",
                        CategoryId = categories.First(c => c.NameAr == "فيتامينات").Id,
                        Price = 35.00m,
                        Stock = 80,
                        ExpiryDate = DateTime.UtcNow.AddYears(2),
                        ImageUrl = "https://example.com/vitamin-c.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Medicine
                    {
                        NameAr = "فيتامين د",
                        NameEn = "Vitamin D",
                        DescriptionAr = "فيتامين ضروري لصحة العظام",
                        DescriptionEn = "Essential vitamin for bone health",
                        CategoryId = categories.First(c => c.NameAr == "فيتامينات").Id,
                        Price = 42.75m,
                        Stock = 60,
                        ExpiryDate = DateTime.UtcNow.AddYears(2),
                        ImageUrl = "https://example.com/vitamin-d.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    
                    // Cosmetics
                    new Medicine
                    {
                        NameAr = "كريم ترطيب",
                        NameEn = "Moisturizing Cream",
                        DescriptionAr = "كريم ترطيب للبشرة الجافة",
                        DescriptionEn = "Moisturizing cream for dry skin",
                        CategoryId = categories.First(c => c.NameAr == "مستحضرات تجميل").Id,
                        Price = 55.00m,
                        Stock = 45,
                        ExpiryDate = DateTime.UtcNow.AddYears(1),
                        ImageUrl = "https://example.com/moisturizer.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    
                    // Cardiovascular
                    new Medicine
                    {
                        NameAr = "أسبيرين",
                        NameEn = "Aspirin",
                        DescriptionAr = "دواء لسيولة الدم",
                        DescriptionEn = "Blood thinner medication",
                        CategoryId = categories.First(c => c.NameAr == "أدوية القلب").Id,
                        Price = 12.50m,
                        Stock = 120,
                        ExpiryDate = DateTime.UtcNow.AddYears(2),
                        ImageUrl = "https://example.com/aspirin.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Medicines.AddRangeAsync(medicines);
                await context.SaveChangesAsync();
            }
        }
    }
}