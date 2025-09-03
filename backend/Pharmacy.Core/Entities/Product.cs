using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pharmacy.Core.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string NameArabic { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(500)]
        public string DescriptionArabic { get; set; }

        [Required]
        [StringLength(50)]
        public string Barcode { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        public int MinimumStockLevel { get; set; } = 10;

        [StringLength(50)]
        public string Manufacturer { get; set; }

        [StringLength(50)]
        public string ManufacturerArabic { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public DateTime ManufactureDate { get; set; }

        [StringLength(200)]
        public string ImageUrl { get; set; }

        public bool RequiresPrescription { get; set; }

        public bool IsActive { get; set; } = true;

        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<OrderItem> OrderItems { get; set; }
        public virtual ICollection<PrescriptionItem> PrescriptionItems { get; set; }
    }
}
