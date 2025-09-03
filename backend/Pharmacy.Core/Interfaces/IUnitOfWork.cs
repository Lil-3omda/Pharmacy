using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<Medicine> Medicines { get; }
        IGenericRepository<Product> Products { get; }
        IGenericRepository<Order> Orders { get; }
        IGenericRepository<OrderItem> OrderItems { get; }
        IGenericRepository<Prescription> Prescriptions { get; }
        IGenericRepository<PrescriptionItem> PrescriptionItems { get; }
        IGenericRepository<ApplicationUser> Users { get; }
        
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}