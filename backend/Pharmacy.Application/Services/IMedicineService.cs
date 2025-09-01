using Pharmacy.Application.DTOs;

namespace Pharmacy.Application.Services
{
    public interface IMedicineService
    {
        Task<MedicineDto?> GetByIdAsync(int id);
        Task<IEnumerable<MedicineDto>> GetAllAsync();
        Task<IEnumerable<MedicineDto>> GetByCategoryAsync(int categoryId);
        Task<IEnumerable<MedicineDto>> SearchAsync(MedicineFilterDto filter);
        Task<MedicineDto> CreateAsync(CreateMedicineDto createDto);
        Task<MedicineDto> UpdateAsync(int id, UpdateMedicineDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateStockAsync(int id, int quantity);
        Task<IEnumerable<MedicineDto>> GetLowStockAsync(int threshold = 10);
        Task<IEnumerable<MedicineDto>> GetExpiringSoonAsync(int daysThreshold = 30);
    }
}