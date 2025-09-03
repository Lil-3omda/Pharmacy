using Microsoft.EntityFrameworkCore;
using Pharmacy.Application.DTOs;
using Pharmacy.Application.Services;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Application.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PharmacyDbContext _context;

        public ProductService(IUnitOfWork unitOfWork, PharmacyDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return null;

            return MapToDto(product);
        }

        public async Task<ProductDto?> GetByBarcodeAsync(string barcode)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Barcode == barcode && p.IsActive);

            if (product == null) return null;

            return MapToDto(product);
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive)
                .ToListAsync();

            return products.Select(MapToDto);
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto createDto)
        {
            var product = new Product
            {
                Name = createDto.Name,
                NameArabic = createDto.NameArabic,
                Description = createDto.Description,
                DescriptionArabic = createDto.DescriptionArabic,
                Barcode = GenerateBarcode(),
                Price = createDto.Price,
                StockQuantity = createDto.StockQuantity,
                MinimumStockLevel = createDto.MinimumStockLevel,
                Manufacturer = createDto.Manufacturer,
                ManufacturerArabic = createDto.ManufacturerArabic,
                ExpiryDate = createDto.ExpiryDate,
                ManufactureDate = createDto.ManufactureDate,
                ImageUrl = createDto.ImageUrl,
                RequiresPrescription = createDto.RequiresPrescription,
                CategoryId = createDto.CategoryId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(product.Id) ?? new ProductDto();
        }

        public async Task<ProductDto> UpdateAsync(int id, CreateProductDto updateDto)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
                throw new InvalidOperationException("Product not found");

            product.Name = updateDto.Name;
            product.NameArabic = updateDto.NameArabic;
            product.Description = updateDto.Description;
            product.DescriptionArabic = updateDto.DescriptionArabic;
            product.Price = updateDto.Price;
            product.StockQuantity = updateDto.StockQuantity;
            product.MinimumStockLevel = updateDto.MinimumStockLevel;
            product.Manufacturer = updateDto.Manufacturer;
            product.ManufacturerArabic = updateDto.ManufacturerArabic;
            product.ExpiryDate = updateDto.ExpiryDate;
            product.ManufactureDate = updateDto.ManufactureDate;
            product.ImageUrl = updateDto.ImageUrl;
            product.RequiresPrescription = updateDto.RequiresPrescription;
            product.CategoryId = updateDto.CategoryId;
            product.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(product.Id) ?? new ProductDto();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            product.IsActive = false;
            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateStockAsync(int id, int quantity)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            product.StockQuantity += quantity;
            if (product.StockQuantity < 0) product.StockQuantity = 0;

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<ProductDto>> GetLowStockAsync(int threshold = 10)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.StockQuantity <= threshold && p.IsActive)
                .ToListAsync();

            return products.Select(MapToDto);
        }

        public async Task<IEnumerable<ProductDto>> GetExpiringSoonAsync(int daysThreshold = 30)
        {
            var thresholdDate = DateTime.UtcNow.AddDays(daysThreshold);
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.ExpiryDate <= thresholdDate && p.IsActive)
                .ToListAsync();

            return products.Select(MapToDto);
        }

        private ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                NameArabic = product.NameArabic,
                Description = product.Description,
                DescriptionArabic = product.DescriptionArabic,
                Barcode = product.Barcode,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                MinimumStockLevel = product.MinimumStockLevel,
                Manufacturer = product.Manufacturer,
                ManufacturerArabic = product.ManufacturerArabic,
                ExpiryDate = product.ExpiryDate,
                ImageUrl = product.ImageUrl,
                RequiresPrescription = product.RequiresPrescription,
                IsActive = product.IsActive,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? "",
                CategoryNameArabic = product.Category?.Name ?? ""
            };
        }

        private string GenerateBarcode()
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
            var random = new Random().Next(1000, 9999).ToString();
            return $"PH{timestamp}{random}";
        }
    }
}