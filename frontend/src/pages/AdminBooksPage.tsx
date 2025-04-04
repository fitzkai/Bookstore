import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { DeleteBook, fetchBooks } from '../api/BooksAPI';
import Pagination from "../components/Pagination";
import NewBookForm from "../components/NewBookForm";
import EditBookForm from "../components/EditBookForm";

const AdminBooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [cardCount, setCardCount] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const data = await fetchBooks(cardCount, pageNum, [])
                setBooks(data.books);
                setTotalPages(Math.ceil(data.totalNumBooks / cardCount))
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, [cardCount, pageNum]);

    const handleDelete = async (bookID: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (!confirmDelete) return;

        try {
            await DeleteBook(bookID);
            setBooks(books.filter((b) => b.bookID !== bookID));
        } catch (error) {
            alert("Failed to delete project. Please try again");
        }
    };

    if (loading) return <p>Loading books...</p>
    if (error) return <p>Error: {error} </p>

    return (
        <div>
            <h1>Admin - Books</h1>

            {!showForm && (
                <button
                    className="btn btn-success mb-3"
                    onClick={() => setShowForm(true)}
                >Add Book</button>
            )}

            {showForm && (
                <NewBookForm
                    onSuccess={() => {
                        setShowForm(false);
                        fetchBooks(cardCount, pageNum, []).then((data) => setBooks(data.books));
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingBook && (
                <EditBookForm book={editingBook} onSuccess={() => {
                    setEditingBook(null);
                    fetchBooks(cardCount, pageNum, []).then((data) => setBooks(data.books));
                }} onCancel={() => setEditingBook(null)}
                />
            )}

            {/* setting up a table of each book info for readability */}
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Page Count</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((b) => (
                        <tr key={b.bookID}>
                            <td>{b.bookID}</td>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.publisher}</td>
                            <td>{b.isbn}</td>
                            <td>{b.classification}</td>
                            <td>{b.category}</td>
                            <td>{b.pageCount}</td>
                            <td>{b.price}</td>
                            <td>
                                <button className="btn btn-primary btn-sm w-100 mb-1" onClick={() => setEditingBook(b)}>Edit</button>
                                <button className="btn btn-danger btn-sm w-100 mb-1" onClick={() => handleDelete(b.bookID)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
            currentPage={pageNum}
            totalPages={totalPages}
            pageSize={cardCount}
            onPageChange={setPageNum}
            onPageSizeChange={(newSize) => {
                setCardCount(newSize);
                setPageNum(1);
            }}
            />
        </div>
    )
};

export default AdminBooksPage;