import { useEffect, useState } from "react";
import { Book } from "./types/Book";

function BookList()
{
    const [books, setBooks] = useState<Book[]>([]);
    const [cardCount, setCardCount] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalBooks, setTotalBooks] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sort, setSort] = useState<string>("title");

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`https://localhost:5000/Book/AllBooks?cardCount=${cardCount}&pageNum=${pageNum}&sort=${sort}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalBooks(data.totalNumBooks);
            setTotalPages(Math.ceil(totalBooks / cardCount))
        };

        fetchBooks();

    }, [cardCount, pageNum, totalBooks, sort])

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value); // Update sort state
        setPageNum(1); // Reset to first page when sorting changes
        setBooks([]); // Force re-render by clearing current book list
    };

    return (
        <>
            <h1>Hilton's Booklist</h1>
            <br />

            {/* add sorting */}
            <label>Sort by: </label>
            <select value={sort} onChange={handleSortChange}>
                <option value="title">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
            </select>
            <br />

            {books.map((b) => (
            <div id="bookCard" className='card' key={b.bookId}>
                <h3 className="card-title">{b.title}</h3>

                <div className="card-body">
                    <ul className="list-unstyled">
                        <li><strong>Author:</strong> {b.author}</li>
                        <li><strong>Publisher:</strong> {b.publisher}</li>
                        <li><strong>ISBN:</strong> {b.isbn}</li>
                        <li><strong>Classification/Category:</strong> {b.classification}/{b.category}</li>
                        <li><strong>Number of Pages:</strong> {b.pageCount}</li>
                        <li><strong>Price:</strong> {b.price}</li>
                    </ul>
                </div>
            </div>
            ))}

            <button disabled={pageNum === 1}  onClick={() => setPageNum(pageNum - 1)}>Previous</button>

            {[...Array(totalPages)].map((_, index) => (
                    <button key={index + 1} onClick={() => setPageNum(index + 1)} disabled={pageNum === (index + 1)}>
                        {index + 1}
                    </button>
                ))}

            <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>

            <br />
            <label>
                Results per page:
                <select value={cardCount} onChange={(p) => {setCardCount(Number(p.target.value));
                    setPageNum(1);
                }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    );
}

export default BookList;