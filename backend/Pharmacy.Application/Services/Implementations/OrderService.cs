using Microsoft.EntityFrameworkCore;
using Pharmacy.Application.DTOs;
using Pharmacy.Application.Services;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Application.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PharmacyDbContext _context;

        public OrderService(IUnitOfWork unitOfWork, PharmacyDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<OrderDto?> GetByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return null;

            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserName = order.User.FullName,
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                Notes = order.Notes,
                OrderDate = order.OrderDate,
                ProcessedDate = order.ProcessedDate,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    MedicineId = oi.MedicineId,
                    MedicineNameAr = oi.Medicine.NameAr,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };
        }

        public async Task<IEnumerable<OrderDto>> GetAllAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = o.User.FullName,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                Notes = o.Notes,
                OrderDate = o.OrderDate,
                ProcessedDate = o.ProcessedDate,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    MedicineId = oi.MedicineId,
                    MedicineNameAr = oi.Medicine.NameAr,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            });
        }

        public async Task<IEnumerable<OrderDto>> GetByUserAsync(string userId)
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = o.User.FullName,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                Notes = o.Notes,
                OrderDate = o.OrderDate,
                ProcessedDate = o.ProcessedDate,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    MedicineId = oi.MedicineId,
                    MedicineNameAr = oi.Medicine.NameAr,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            });
        }

        public async Task<IEnumerable<OrderDto>> GetByStatusAsync(string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
                return Enumerable.Empty<OrderDto>();

            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .Where(o => o.Status == orderStatus)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = o.User.FullName,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                Notes = o.Notes,
                OrderDate = o.OrderDate,
                ProcessedDate = o.ProcessedDate,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    MedicineId = oi.MedicineId,
                    MedicineNameAr = oi.Medicine.NameAr,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            });
        }

        public async Task<OrderDto> CreateAsync(string userId, CreateOrderDto createDto)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var totalPrice = await CalculateTotalAsync(createDto.Items);

                var order = new Order
                {
                    UserId = userId,
                    TotalPrice = totalPrice,
                    Status = OrderStatus.Pending,
                    Notes = createDto.Notes,
                    OrderDate = DateTime.UtcNow
                };

                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.SaveChangesAsync();

                foreach (var item in createDto.Items)
                {
                    var medicine = await _unitOfWork.Medicines.GetByIdAsync(item.MedicineId);
                    if (medicine == null)
                        throw new InvalidOperationException($"Medicine with ID {item.MedicineId} not found");

                    if (medicine.Stock < item.Quantity)
                        throw new InvalidOperationException($"Insufficient stock for medicine {medicine.NameAr}");

                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        MedicineId = item.MedicineId,
                        Quantity = item.Quantity,
                        UnitPrice = medicine.Price,
                        TotalPrice = medicine.Price * item.Quantity
                    };

                    await _unitOfWork.OrderItems.AddAsync(orderItem);

                    // Update stock
                    medicine.Stock -= item.Quantity;
                    await _unitOfWork.Medicines.UpdateAsync(medicine);
                }

                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                return await GetByIdAsync(order.Id) ?? new OrderDto();
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<OrderDto> UpdateStatusAsync(int id, UpdateOrderStatusDto updateDto)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
                throw new InvalidOperationException("Order not found");

            order.Status = updateDto.Status;
            order.Notes = updateDto.Notes;
            order.ProcessedDate = DateTime.UtcNow;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(order.Id) ?? new OrderDto();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return false;

            // Only allow deletion of pending orders
            if (order.Status != OrderStatus.Pending)
                return false;

            await _unitOfWork.Orders.DeleteAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<decimal> CalculateTotalAsync(List<CreateOrderItemDto> items)
        {
            decimal total = 0;

            foreach (var item in items)
            {
                var medicine = await _unitOfWork.Medicines.GetByIdAsync(item.MedicineId);
                if (medicine == null)
                    throw new InvalidOperationException($"Medicine with ID {item.MedicineId} not found");

                total += medicine.Price * item.Quantity;
            }

            return total;
        }

        public async Task<bool> ProcessOrderAsync(int orderId)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null) return false;

            order.Status = OrderStatus.Completed;
            order.ProcessedDate = DateTime.UtcNow;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}