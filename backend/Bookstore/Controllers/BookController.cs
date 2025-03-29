using Bookstore.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bookstore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int cardCount = 5, int pageNum = 1, string? sort = "title", [FromQuery] List<string>? bookTypes = null) 
        {

            IQueryable<Book> bookSort = _bookContext.Books;

            if (sort == "title")
            {
                bookSort = bookSort.OrderBy(x => x.Title);
            }
            else if (sort == "title_desc")
            {
                bookSort = bookSort.OrderByDescending(x => x.Title);
            }

            if (bookTypes != null && bookTypes.Any())
            {
                bookSort = bookSort.Where(b => bookTypes.Contains(b.Category));
            }

            var books = bookSort
                .Skip((pageNum - 1) * cardCount)
                .Take(cardCount)
                .ToList();

            var totalNumBooks = bookSort.Count();

            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks,
            });
        }

        [HttpGet("GetBookTypes")]
        public IActionResult GetBookTypes()
        {
            var bookTypes = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookTypes);
        }
    }
}
