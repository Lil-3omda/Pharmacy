using Pharmacy.Application.DTOs;

namespace Pharmacy.Application.Services
{
    public interface ICategoryService
    {
        Task<CategoryDto?> GetByIdAsync(int id);
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        Task<CategoryDto> CreateAsync(CreateCategoryDto createDto);
        Task<CategoryDto> UpdateAsync(int id, UpdateCategoryDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}