using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pharmacy.Core.Entities
{
    public class Prescription
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        [Required]
        [StringLength(100)]
        public string DoctorName { get; set; }

        [Required]
        [StringLength(100)]
        public string PatientName { get; set; }

        [Required]
        public DateTime PrescriptionDate { get; set; }

        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; }

        public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Pending;

        [StringLength(500)]
        public string PharmacistNotes { get; set; }

        public string ApprovedByUserId { get; set; }
        public virtual ApplicationUser ApprovedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<PrescriptionItem> PrescriptionItems { get; set; }
    }

    public enum PrescriptionStatus
    {
        Pending,
        Approved,
        Rejected,
        Fulfilled
    }
}
