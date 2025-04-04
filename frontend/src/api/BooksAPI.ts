import { Book } from  '../types/Book';

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

const API_URL = "https://bookstore-kaitlyn-backend-bqgwdnhtbwcqehca.eastus-01.azurewebsites.net/Book"

export const fetchBooks = async (
    cardCount: number,
    pageNum: number,
    selectedCategories: string[]
): Promise<FetchBooksResponse> => {
    try {
        const categoryParams = selectedCategories
            .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
            .join("&");

        const response = await fetch(
            `${API_URL}/AllBooks?cardCount=${cardCount}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}`: ''}`
        );

    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }
        return await response.json();
    } catch (error) {
        console.error("Error fetching books: ", error);
        throw error;
    }
};

export const AddBook = async (newBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/AddBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });
        
        if (!response.ok) {
            throw new Error('Failed to add book');
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding book", error);
        throw error;
    }
};

export const UpdateBook = async (bookID: number, updatedBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook),
        });

        return await response.json();
    } catch (error) {
        console.error("Error updating book ", error);
        throw error;
    }
};

export const DeleteBook = async (bookID: number): Promise<void>  => {
    try {
        const response = await fetch(`${API_URL}/DeleteBook/${bookID}`, 
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete book");
        }

    } catch (error) {
        console.error("Eror deleting book ", error);
        throw error;
    }
}