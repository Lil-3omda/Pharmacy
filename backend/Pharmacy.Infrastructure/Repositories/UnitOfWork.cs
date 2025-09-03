using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PharmacyDbContext _context;
        private IGenericRepository<Category>? _categories;
        private IGenericRepository<Medicine>? _medicines;
        private IGenericRepository<Product>? _products;
        private IGenericRepository<Order>? _orders;
        private IGenericRepository<OrderItem>? _orderItems;
        private IGenericRepository<Prescription>? _prescriptions;
        private IGenericRepository<PrescriptionItem>? _prescriptionItems;
        private IGenericRepository<ApplicationUser>? _users;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(PharmacyDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<Category> Categories => 
            _categories ??= new GenericRepository<Category>(_context);

        public IGenericRepository<Medicine> Medicines => 
            _medicines ??= new GenericRepository<Medicine>(_context);

        public IGenericRepository<Product> Products => 
            _products ??= new GenericRepository<Product>(_context);
        public IGenericRepository<Order> Orders => 
            _orders ??= new GenericRepository<Order>(_context);

        public IGenericRepository<OrderItem> OrderItems => 
            _orderItems ??= new GenericRepository<OrderItem>(_context);

        public IGenericRepository<Prescription> Prescriptions => 
            _prescriptions ??= new GenericRepository<Prescription>(_context);

        public IGenericRepository<PrescriptionItem> PrescriptionItems => 
            _prescriptionItems ??= new GenericRepository<PrescriptionItem>(_context);
        public IGenericRepository<ApplicationUser> Users => 
            _users ??= new GenericRepository<ApplicationUser>(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}