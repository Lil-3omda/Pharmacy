using Pharmacy.Application.DTOs;

namespace Pharmacy.Application.Services
{
    public interface IProductService
    {
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto?> GetByBarcodeAsync(string barcode);
        Task<IEnumerable<ProductDto>> GetAllAsync();
        Task<ProductDto> CreateAsync(CreateProductDto createDto);
        Task<ProductDto> UpdateAsync(int id, CreateProductDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateStockAsync(int id, int quantity);
        Task<IEnumerable<ProductDto>> GetLowStockAsync(int threshold = 10);
        Task<IEnumerable<ProductDto>> GetExpiringSoonAsync(int daysThreshold = 30);
    }
}