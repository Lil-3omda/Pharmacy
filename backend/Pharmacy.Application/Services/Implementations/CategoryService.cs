using Microsoft.EntityFrameworkCore;
using Pharmacy.Application.DTOs;
using Pharmacy.Application.Services;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Application.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PharmacyDbContext _context;

        public CategoryService(IUnitOfWork unitOfWork, PharmacyDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Medicines)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return null;

            return new CategoryDto
            {
                Id = category.Id,
                NameAr = category.NameAr,
                NameEn = category.NameEn,
                DescriptionAr = category.DescriptionAr,
                DescriptionEn = category.DescriptionEn,
                IsActive = category.IsActive,
                MedicineCount = category.Medicines.Count(m => m.IsActive)
            };
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _context.Categories
                .Include(c => c.Medicines)
                .Where(c => c.IsActive)
                .ToListAsync();

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                NameAr = c.NameAr,
                NameEn = c.NameEn,
                DescriptionAr = c.DescriptionAr,
                DescriptionEn = c.DescriptionEn,
                IsActive = c.IsActive,
                MedicineCount = c.Medicines.Count(m => m.IsActive)
            });
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto createDto)
        {
            var category = new Category
            {
                NameAr = createDto.NameAr,
                NameEn = createDto.NameEn,
                DescriptionAr = createDto.DescriptionAr,
                DescriptionEn = createDto.DescriptionEn,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(category.Id) ?? new CategoryDto();
        }

        public async Task<CategoryDto> UpdateAsync(int id, UpdateCategoryDto updateDto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                throw new InvalidOperationException("Category not found");

            category.NameAr = updateDto.NameAr;
            category.NameEn = updateDto.NameEn;
            category.DescriptionAr = updateDto.DescriptionAr;
            category.DescriptionEn = updateDto.DescriptionEn;

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(category.Id) ?? new CategoryDto();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return false;

            // Check if category has medicines
            var hasMedicines = await _context.Medicines.AnyAsync(m => m.CategoryId == id && m.IsActive);
            if (hasMedicines)
                return false; // Cannot delete category with active medicines

            category.IsActive = false;
            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _unitOfWork.Categories.ExistsAsync(c => c.Id == id && c.IsActive);
        }
    }
}