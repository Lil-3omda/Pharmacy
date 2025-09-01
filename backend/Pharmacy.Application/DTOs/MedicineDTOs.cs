using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Application.DTOs
{
    public class MedicineDto
    {
        public int Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryNameAr { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateMedicineDto
    {
        [Required]
        public string NameAr { get; set; } = string.Empty;
        
        [Required]
        public string NameEn { get; set; } = string.Empty;
        
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        
        [Required]
        public int CategoryId { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        
        [Required]
        public DateTime ExpiryDate { get; set; }
        
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class UpdateMedicineDto
    {
        [Required]
        public string NameAr { get; set; } = string.Empty;
        
        [Required]
        public string NameEn { get; set; } = string.Empty;
        
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        
        [Required]
        public int CategoryId { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        
        [Required]
        public DateTime ExpiryDate { get; set; }
        
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class MedicineFilterDto
    {
        public string? SearchTerm { get; set; }
        public int? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? InStock { get; set; }
        public bool? ExpiringSoon { get; set; }
    }
}