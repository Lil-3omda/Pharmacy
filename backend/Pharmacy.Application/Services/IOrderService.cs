using Pharmacy.Application.DTOs;

namespace Pharmacy.Application.Services
{
    public interface IOrderService
    {
        Task<OrderDto?> GetByIdAsync(int id);
        Task<IEnumerable<OrderDto>> GetAllAsync();
        Task<IEnumerable<OrderDto>> GetByUserAsync(string userId);
        Task<IEnumerable<OrderDto>> GetByStatusAsync(string status);
        Task<OrderDto> CreateAsync(string userId, CreateOrderDto createDto);
        Task<OrderDto> UpdateStatusAsync(int id, UpdateOrderStatusDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<decimal> CalculateTotalAsync(List<CreateOrderItemDto> items);
        Task<bool> ProcessOrderAsync(int orderId);
    }
}