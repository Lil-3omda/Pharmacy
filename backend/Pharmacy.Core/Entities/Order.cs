using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Core.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal FinalAmount { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [StringLength(500)]
        public string Notes { get; set; }

        [StringLength(200)]
        public string ShippingAddress { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        public int? DiscountCodeId { get; set; }
        public virtual DiscountCode DiscountCode { get; set; }

        public int? PrescriptionId { get; set; }
        public virtual Prescription Prescription { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }

    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Processing,
        Ready,
        Delivered,
        Cancelled
    }
}