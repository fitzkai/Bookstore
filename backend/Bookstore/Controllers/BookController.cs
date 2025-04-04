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

            var bookSort = _bookContext.Books.AsQueryable();

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

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookID}")]
        public IActionResult UpdateBook(int bookID, [FromBody] Book updatedBook)
        {
            var exisitingBook = _bookContext.Books.Find(bookID);

            exisitingBook.Title = updatedBook.Title;
            exisitingBook.Author = updatedBook.Author;
            exisitingBook.Publisher = updatedBook.Publisher;
            exisitingBook.ISBN = updatedBook.ISBN;
            exisitingBook.Classification = updatedBook.Classification;
            exisitingBook.Category = updatedBook.Category;
            exisitingBook.PageCount = updatedBook.PageCount;
            exisitingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(exisitingBook);
            _bookContext.SaveChanges();

            return Ok(updatedBook);
        }

        [HttpDelete("DeleteBook/{bookID}")]

        public IActionResult DeleteBook(int bookID)
        {
            var book = _bookContext.Books.Find(bookID);

            if (book == null)
            {
                return NotFound(new { message = "Book Not Found" });
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
