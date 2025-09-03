using Microsoft.EntityFrameworkCore;
using Pharmacy.Application.DTOs;
using Pharmacy.Core.Entities;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Application.Services.Implementations
{
    public interface IAnalyticsService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<SalesChartDto>> GetSalesChartDataAsync(DateTime fromDate, DateTime toDate);
        Task<List<TopProductDto>> GetTopSellingProductsAsync(int count = 10);
        Task<List<LowStockAlertDto>> GetLowStockAlertsAsync();
    }

    public class AnalyticsService : IAnalyticsService
    {
        private readonly PharmacyDbContext _context;

        public AnalyticsService(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalProducts = await _context.Medicines.CountAsync(m => m.IsActive);
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Completed)
                .SumAsync(o => o.TotalPrice);
            var pendingOrders = await _context.Orders
                .CountAsync(o => o.Status == OrderStatus.Pending);
            var lowStockCount = await _context.Medicines
                .CountAsync(m => m.Stock <= 10);

            return new DashboardStatsDto
            {
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                PendingOrders = pendingOrders,
                LowStockAlerts = lowStockCount
            };
        }

        public async Task<List<SalesChartDto>> GetSalesChartDataAsync(DateTime fromDate, DateTime toDate)
        {
            return await _context.Orders
                .Where(o => o.OrderDate >= fromDate && o.OrderDate <= toDate && o.Status == OrderStatus.Completed)
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new SalesChartDto
                {
                    Date = g.Key,
                    Sales = g.Sum(o => o.TotalPrice),
                    OrderCount = g.Count()
                })
                .OrderBy(s => s.Date)
                .ToListAsync();
        }

        public async Task<List<TopProductDto>> GetTopSellingProductsAsync(int count = 10)
        {
            return await _context.OrderItems
                .Include(oi => oi.Medicine)
                .GroupBy(oi => oi.MedicineId)
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key,
                    ProductName = g.First().Medicine.NameAr,
                    TotalQuantitySold = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.TotalPrice)
                })
                .OrderByDescending(p => p.TotalQuantitySold)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<LowStockAlertDto>> GetLowStockAlertsAsync()
        {
            return await _context.Medicines
                .Include(m => m.Category)
                .Where(m => m.Stock <= 10 && m.IsActive)
                .Select(m => new LowStockAlertDto
                {
                    ProductId = m.Id,
                    ProductName = m.NameAr,
                    CurrentStock = m.Stock,
                    MinimumLevel = 10,
                    Category = m.Category.Name
                })
                .ToListAsync();
        }
    }
}
