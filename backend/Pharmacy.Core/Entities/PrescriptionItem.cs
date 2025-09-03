using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Core.Entities
{
    public class PrescriptionItem
    {
        [Key]
        public int Id { get; set; }

        public int PrescriptionId { get; set; }
        public virtual Prescription Prescription { get; set; } = null!;

        public int MedicineId { get; set; }
        public virtual Medicine Medicine { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Dosage { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Instructions { get; set; } = string.Empty;

        [Required]
        public int Quantity { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}