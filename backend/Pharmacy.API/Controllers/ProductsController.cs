using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.Application.Services;
using Pharmacy.Core.Entities;

namespace Pharmacy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IBarcodeService _barcodeService;

        public ProductsController(ApplicationDbContext context, IBarcodeService barcodeService)
        {
            _context = context;
            _barcodeService = barcodeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
            [FromQuery] string search = "",
            [FromQuery] int? categoryId = null,
            [FromQuery] bool includeInactive = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (!includeInactive)
                query = query.Where(p => p.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.NameArabic.Contains(search) ||
                    p.Barcode.Contains(search));
            }

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId);

            var totalCount = await query.CountAsync();
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    NameArabic = p.NameArabic,
                    Description = p.Description,
                    DescriptionArabic = p.DescriptionArabic,
                    Barcode = p.Barcode,
                    Price = p.Price,
                    StockQuantity = p.StockQuantity,
                    MinimumStockLevel = p.MinimumStockLevel,
                    Manufacturer = p.Manufacturer,
                    ManufacturerArabic = p.ManufacturerArabic,
                    ExpiryDate = p.ExpiryDate,
                    ImageUrl = p.ImageUrl,
                    RequiresPrescription = p.RequiresPrescription,
                    IsActive = p.IsActive,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    CategoryNameArabic = p.Category.NameArabic
                })
                .ToListAsync();

            return Ok(new
            {
                Products = products,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return Ok(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                NameArabic = product.NameArabic,
                Description = product.Description,
                DescriptionArabic = product.DescriptionArabic,
                Barcode = product.Barcode,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                MinimumStockLevel = product.MinimumStockLevel,
                Manufacturer = product.Manufacturer,
                ManufacturerArabic = product.ManufacturerArabic,
                ExpiryDate = product.ExpiryDate,
                ImageUrl = product.ImageUrl,
                RequiresPrescription = product.RequiresPrescription,
                IsActive = product.IsActive,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                CategoryNameArabic = product.Category.NameArabic
            });
        }

        [HttpGet("barcode/{barcode}")]
        public async Task<ActionResult<ProductDto>> GetProductByBarcode(string barcode)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Barcode == barcode && p.IsActive);

            if (product == null)
                return NotFound("Product not found");

            return Ok(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                NameArabic = product.NameArabic,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                Barcode = product.Barcode,
                CategoryName = product.Category.Name,
                RequiresPrescription = product.RequiresPrescription
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                NameArabic = createProductDto.NameArabic,
                Description = createProductDto.Description,
                DescriptionArabic = createProductDto.DescriptionArabic,
                Barcode = _barcodeService.GenerateBarcode(),
                Price = createProductDto.Price,
                StockQuantity = createProductDto.StockQuantity,
                MinimumStockLevel = createProductDto.MinimumStockLevel,
                Manufacturer = createProductDto.Manufacturer,
                ManufacturerArabic = createProductDto.ManufacturerArabic,
                ExpiryDate = createProductDto.ExpiryDate,
                ManufactureDate = createProductDto.ManufactureDate,
                ImageUrl = createProductDto.ImageUrl,
                RequiresPrescription = createProductDto.RequiresPrescription,
                CategoryId = createProductDto.CategoryId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPost("barcode-image/{barcode}")]
        public IActionResult GenerateBarcodeImage(string barcode)
        {
            var imageData = _barcodeService.GenerateBarcodeImage(barcode);
            return File(imageData, "image/png");
        }
    }
}
