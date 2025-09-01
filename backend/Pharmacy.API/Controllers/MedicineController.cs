using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.Application.DTOs;
using Pharmacy.Application.Services;

namespace Pharmacy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicineController : ControllerBase
    {
        private readonly IMedicineService _medicineService;

        public MedicineController(IMedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineDto>>> GetAll()
        {
            var medicines = await _medicineService.GetAllAsync();
            return Ok(medicines);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicineDto>> GetById(int id)
        {
            var medicine = await _medicineService.GetByIdAsync(id);
            if (medicine == null)
                return NotFound();

            return Ok(medicine);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<MedicineDto>>> GetByCategory(int categoryId)
        {
            var medicines = await _medicineService.GetByCategoryAsync(categoryId);
            return Ok(medicines);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<MedicineDto>>> Search([FromQuery] MedicineFilterDto filter)
        {
            var medicines = await _medicineService.SearchAsync(filter);
            return Ok(medicines);
        }

        [HttpGet("low-stock")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult<IEnumerable<MedicineDto>>> GetLowStock([FromQuery] int threshold = 10)
        {
            var medicines = await _medicineService.GetLowStockAsync(threshold);
            return Ok(medicines);
        }

        [HttpGet("expiring-soon")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult<IEnumerable<MedicineDto>>> GetExpiringSoon([FromQuery] int daysThreshold = 30)
        {
            var medicines = await _medicineService.GetExpiringSoonAsync(daysThreshold);
            return Ok(medicines);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult<MedicineDto>> Create(CreateMedicineDto createDto)
        {
            try
            {
                var medicine = await _medicineService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = medicine.Id }, medicine);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult<MedicineDto>> Update(int id, UpdateMedicineDto updateDto)
        {
            try
            {
                var medicine = await _medicineService.UpdateAsync(id, updateDto);
                return Ok(medicine);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _medicineService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/stock")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult> UpdateStock(int id, [FromBody] UpdateStockRequest request)
        {
            var result = await _medicineService.UpdateStockAsync(id, request.Quantity);
            if (!result)
                return NotFound();

            return Ok(new { message = "Stock updated successfully" });
        }
    }

    public class UpdateStockRequest
    {
        public int Quantity { get; set; }
    }
}