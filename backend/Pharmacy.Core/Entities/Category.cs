using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Core.Entities
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string NameEn { get; set; } = string.Empty;

        [StringLength(200)]
        public string DescriptionAr { get; set; } = string.Empty;

        [StringLength(200)]
        public string DescriptionEn { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
    }
}