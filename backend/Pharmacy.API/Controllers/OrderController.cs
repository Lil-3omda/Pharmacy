using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.Application.DTOs;
using Pharmacy.Application.Services;

namespace Pharmacy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(int id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
                return NotFound();

            // Check if user is authorized to view this order
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            if (order.UserId != userId && userRole != "Admin" && userRole != "Pharmacist")
                return Forbid();

            return Ok(order);
        }

        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var orders = await _orderService.GetByUserAsync(userId);
            return Ok(orders);
        }

        [HttpGet("status/{status}")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetByStatus(string status)
        {
            var orders = await _orderService.GetByStatusAsync(status);
            return Ok(orders);
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> Create(CreateOrderDto createDto)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var order = await _orderService.CreateAsync(userId, createDto);
                return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult<OrderDto>> UpdateStatus(int id, UpdateOrderStatusDto updateDto)
        {
            try
            {
                var order = await _orderService.UpdateStatusAsync(id, updateDto);
                return Ok(order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
                return NotFound();

            // Check if user is authorized to delete this order
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            if (order.UserId != userId && userRole != "Admin")
                return Forbid();

            var result = await _orderService.DeleteAsync(id);
            if (!result)
                return BadRequest(new { message = "Cannot delete this order" });

            return NoContent();
        }

        [HttpPost("{id}/process")]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<ActionResult> ProcessOrder(int id)
        {
            var result = await _orderService.ProcessOrderAsync(id);
            if (!result)
                return NotFound();

            return Ok(new { message = "Order processed successfully" });
        }

        [HttpPost("calculate-total")]
        public async Task<ActionResult<decimal>> CalculateTotal([FromBody] List<CreateOrderItemDto> items)
        {
            try
            {
                var total = await _orderService.CalculateTotalAsync(items);
                return Ok(total);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}