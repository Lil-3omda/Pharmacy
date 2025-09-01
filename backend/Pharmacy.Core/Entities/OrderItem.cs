namespace Pharmacy.Core.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int MedicineId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        
        // Navigation properties
        public virtual Order Order { get; set; } = null!;
        public virtual Medicine Medicine { get; set; } = null!;
    }
}