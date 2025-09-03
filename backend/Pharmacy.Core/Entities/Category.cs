using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Core.Entities
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string NameArabic { get; set; }

        [StringLength(200)]
        public string Description { get; set; }

        [StringLength(200)]
        public string DescriptionArabic { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual ICollection<Product> Products { get; set; }
    }
}