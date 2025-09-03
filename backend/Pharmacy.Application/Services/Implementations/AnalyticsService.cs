using Pharmacy.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        private readonly ApplicationDbContext _context;

        public AnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Delivered)
                .SumAsync(o => o.FinalAmount);
            var pendingOrders = await _context.Orders
                .CountAsync(o => o.Status == OrderStatus.Pending);
            var lowStockCount = await _context.Products
                .CountAsync(p => p.StockQuantity <= p.MinimumStockLevel);

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
                .Where(o => o.OrderDate >= fromDate && o.OrderDate <= toDate && o.Status == OrderStatus.Delivered)
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new SalesChartDto
                {
                    Date = g.Key,
                    Sales = g.Sum(o => o.FinalAmount),
                    OrderCount = g.Count()
                })
                .OrderBy(s => s.Date)
                .ToListAsync();
        }

        public async Task<List<TopProductDto>> GetTopSellingProductsAsync(int count = 10)
        {
            return await _context.OrderItems
                .Include(oi => oi.Product)
                .GroupBy(oi => oi.ProductId)
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key,
                    ProductName = g.First().Product.Name,
                    TotalQuantitySold = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.TotalPrice)
                })
                .OrderByDescending(p => p.TotalQuantitySold)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<LowStockAlertDto>> GetLowStockAlertsAsync()
        {
            return await _context.Products
                .Where(p => p.StockQuantity <= p.MinimumStockLevel && p.IsActive)
                .Select(p => new LowStockAlertDto
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    CurrentStock = p.StockQuantity,
                    MinimumLevel = p.MinimumStockLevel,
                    Category = p.Category.Name
                })
                .ToListAsync();
        }
    }
}
