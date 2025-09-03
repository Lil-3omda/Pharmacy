using Microsoft.EntityFrameworkCore;
using Pharmacy.Application.DTOs;
using Pharmacy.Application.Services;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Application.Services.Implementations
{
    public class MedicineService : IMedicineService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PharmacyDbContext _context;

        public MedicineService(IUnitOfWork unitOfWork, PharmacyDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<MedicineDto?> GetByIdAsync(int id)
        {
            var medicine = await _context.Medicines
                .Include(m => m.Category)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (medicine == null) return null;

            return new MedicineDto
            {
                Id = medicine.Id,
                NameAr = medicine.NameAr,
                NameEn = medicine.NameEn,
                DescriptionAr = medicine.DescriptionAr,
                DescriptionEn = medicine.DescriptionEn,
                CategoryId = medicine.CategoryId,
                CategoryNameAr = medicine.Category.Name,
                Price = medicine.Price,
                Stock = medicine.Stock,
                ExpiryDate = medicine.ExpiryDate,
                ImageUrl = medicine.ImageUrl,
                IsActive = medicine.IsActive
            };
        }

        public async Task<IEnumerable<MedicineDto>> GetAllAsync()
        {
            var medicines = await _context.Medicines
                .Include(m => m.Category)
                .Where(m => m.IsActive)
                .ToListAsync();

            return medicines.Select(m => new MedicineDto
            {
                Id = m.Id,
                NameAr = m.NameAr,
                NameEn = m.NameEn,
                DescriptionAr = m.DescriptionAr,
                DescriptionEn = m.DescriptionEn,
                CategoryId = m.CategoryId,
                CategoryNameAr = m.Category.Name,
                Price = m.Price,
                Stock = m.Stock,
                ExpiryDate = m.ExpiryDate,
                ImageUrl = m.ImageUrl,
                IsActive = m.IsActive
            });
        }

        public async Task<IEnumerable<MedicineDto>> GetByCategoryAsync(int categoryId)
        {
            var medicines = await _context.Medicines
                .Include(m => m.Category)
                .Where(m => m.CategoryId == categoryId && m.IsActive)
                .ToListAsync();

            return medicines.Select(m => new MedicineDto
            {
                Id = m.Id,
                NameAr = m.NameAr,
                NameEn = m.NameEn,
                DescriptionAr = m.DescriptionAr,
                DescriptionEn = m.DescriptionEn,
                CategoryId = m.CategoryId,
                CategoryNameAr = m.Category.Name,
                Price = m.Price,
                Stock = m.Stock,
                ExpiryDate = m.ExpiryDate,
                ImageUrl = m.ImageUrl,
                IsActive = m.IsActive
            });
        }

        public async Task<IEnumerable<MedicineDto>> SearchAsync(MedicineFilterDto filter)
        {
            var query = _context.Medicines.Include(m => m.Category).AsQueryable();

            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(m => m.NameAr.Contains(filter.SearchTerm) || 
                                       m.NameEn.Contains(filter.SearchTerm) ||
                                       m.DescriptionAr.Contains(filter.SearchTerm));
            }

            if (filter.CategoryId.HasValue)
            {
                query = query.Where(m => m.CategoryId == filter.CategoryId.Value);
            }

            if (filter.MinPrice.HasValue)
            {
                query = query.Where(m => m.Price >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(m => m.Price <= filter.MaxPrice.Value);
            }

            if (filter.InStock.HasValue && filter.InStock.Value)
            {
                query = query.Where(m => m.Stock > 0);
            }

            if (filter.ExpiringSoon.HasValue && filter.ExpiringSoon.Value)
            {
                var thresholdDate = DateTime.UtcNow.AddDays(30);
                query = query.Where(m => m.ExpiryDate <= thresholdDate);
            }

            var medicines = await query.Where(m => m.IsActive).ToListAsync();

            return medicines.Select(m => new MedicineDto
            {
                Id = m.Id,
                NameAr = m.NameAr,
                NameEn = m.NameEn,
                DescriptionAr = m.DescriptionAr,
                DescriptionEn = m.DescriptionEn,
                CategoryId = m.CategoryId,
                CategoryNameAr = m.Category.Name,
                Price = m.Price,
                Stock = m.Stock,
                ExpiryDate = m.ExpiryDate,
                ImageUrl = m.ImageUrl,
                IsActive = m.IsActive
            });
        }

        public async Task<MedicineDto> CreateAsync(CreateMedicineDto createDto)
        {
            var medicine = new Medicine
            {
                NameAr = createDto.NameAr,
                NameEn = createDto.NameEn,
                DescriptionAr = createDto.DescriptionAr,
                DescriptionEn = createDto.DescriptionEn,
                CategoryId = createDto.CategoryId,
                Price = createDto.Price,
                Stock = createDto.Stock,
                ExpiryDate = createDto.ExpiryDate,
                ImageUrl = createDto.ImageUrl,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Medicines.AddAsync(medicine);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(medicine.Id) ?? new MedicineDto();
        }

        public async Task<MedicineDto> UpdateAsync(int id, UpdateMedicineDto updateDto)
        {
            var medicine = await _unitOfWork.Medicines.GetByIdAsync(id);
            if (medicine == null)
                throw new InvalidOperationException("Medicine not found");

            medicine.NameAr = updateDto.NameAr;
            medicine.NameEn = updateDto.NameEn;
            medicine.DescriptionAr = updateDto.DescriptionAr;
            medicine.DescriptionEn = updateDto.DescriptionEn;
            medicine.CategoryId = updateDto.CategoryId;
            medicine.Price = updateDto.Price;
            medicine.Stock = updateDto.Stock;
            medicine.ExpiryDate = updateDto.ExpiryDate;
            medicine.ImageUrl = updateDto.ImageUrl;

            await _unitOfWork.Medicines.UpdateAsync(medicine);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(medicine.Id) ?? new MedicineDto();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var medicine = await _unitOfWork.Medicines.GetByIdAsync(id);
            if (medicine == null) return false;

            medicine.IsActive = false;
            await _unitOfWork.Medicines.UpdateAsync(medicine);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateStockAsync(int id, int quantity)
        {
            var medicine = await _unitOfWork.Medicines.GetByIdAsync(id);
            if (medicine == null) return false;

            medicine.Stock += quantity;
            if (medicine.Stock < 0) medicine.Stock = 0;

            await _unitOfWork.Medicines.UpdateAsync(medicine);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<MedicineDto>> GetLowStockAsync(int threshold = 10)
        {
            var medicines = await _context.Medicines
                .Include(m => m.Category)
                .Where(m => m.Stock <= threshold && m.IsActive)
                .ToListAsync();

            return medicines.Select(m => new MedicineDto
            {
                Id = m.Id,
                NameAr = m.NameAr,
                NameEn = m.NameEn,
                DescriptionAr = m.DescriptionAr,
                DescriptionEn = m.DescriptionEn,
                CategoryId = m.CategoryId,
                CategoryNameAr = m.Category.Name,
                Price = m.Price,
                Stock = m.Stock,
                ExpiryDate = m.ExpiryDate,
                ImageUrl = m.ImageUrl,
                IsActive = m.IsActive
            });
        }

        public async Task<IEnumerable<MedicineDto>> GetExpiringSoonAsync(int daysThreshold = 30)
        {
            var thresholdDate = DateTime.UtcNow.AddDays(daysThreshold);
            var medicines = await _context.Medicines
                .Include(m => m.Category)
                .Where(m => m.ExpiryDate <= thresholdDate && m.IsActive)
                .ToListAsync();

            return medicines.Select(m => new MedicineDto
            {
                Id = m.Id,
                NameAr = m.NameAr,
                NameEn = m.NameEn,
                DescriptionAr = m.DescriptionAr,
                DescriptionEn = m.DescriptionEn,
                CategoryId = m.CategoryId,
                CategoryNameAr = m.Category.Name,
                Price = m.Price,
                Stock = m.Stock,
                ExpiryDate = m.ExpiryDate,
                ImageUrl = m.ImageUrl,
                IsActive = m.IsActive
            });
        }
    }
}