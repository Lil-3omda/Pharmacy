using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Application.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int MedicineCount { get; set; }
    }

    public class CreateCategoryDto
    {
        [Required]
        public string NameAr { get; set; } = string.Empty;
        
        [Required]
        public string NameEn { get; set; } = string.Empty;
        
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
    }

    public class UpdateCategoryDto
    {
        [Required]
        public string NameAr { get; set; } = string.Empty;
        
        [Required]
        public string NameEn { get; set; } = string.Empty;
        
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
    }
}