using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Application.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NameArabic { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DescriptionArabic { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public int MinimumStockLevel { get; set; }
        public string Manufacturer { get; set; } = string.Empty;
        public string ManufacturerArabic { get; set; } = string.Empty;
        public DateTime? ExpiryDate { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool RequiresPrescription { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CategoryNameArabic { get; set; } = string.Empty;
    }

    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string NameArabic { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        public string DescriptionArabic { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        
        public int MinimumStockLevel { get; set; } = 10;
        public string Manufacturer { get; set; } = string.Empty;
        public string ManufacturerArabic { get; set; } = string.Empty;
        
        [Required]
        public DateTime ExpiryDate { get; set; }
        
        public DateTime ManufactureDate { get; set; } = DateTime.UtcNow;
        public string ImageUrl { get; set; } = string.Empty;
        public bool RequiresPrescription { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
    }
}