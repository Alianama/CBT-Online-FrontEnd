import {Button} from "../ui/button";
import {useSearchParams} from "react-router-dom";
import {useState} from "react";
import BookCard from "@/components/lesson/BookCard";
import SearchInput from "@/components/lesson/SearchInput";
// Definisi kategori buku
const BookCategory = {
    all: "All",
    fiction: "Fiction",
    nonFiction: "Non-Fiction",
    science: "Science",
    history: "History",
    technology: "Technology",
};
// Contoh data buku
const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        category: "fiction",
        imageUrl: "https://example.com/images/the-great-gatsby.jpg",
        description: "A classic novel by F. Scott Fitzgerald about the American dream.",
        openUrl: "https://example.com/books/the-great-gatsby",
        downloadUrl: "https://example.com/downloads/the-great-gatsby.pdf",
    },
    {
        id: 2,
        title: "Sapiens: A Brief History of Humankind",
        category: "nonFiction",
        imageUrl: "https://example.com/images/sapiens.jpg",
        description: "An exploration of the history and impact of Homo sapiens.",
        openUrl: "https://example.com/books/sapiens",
        downloadUrl: "https://example.com/downloads/sapiens.pdf",
    },
    {
        id: 3,
        title: "A Brief History of Time",
        category: "science",
        imageUrl: "https://example.com/images/brief-history-of-time.jpg",
        description: "Stephen Hawking's exploration of the universe and time.",
        openUrl: "https://example.com/books/brief-history-of-time",
        downloadUrl: "https://example.com/downloads/brief-history-of-time.pdf",
    },
    {
        id: 4,
        title: "The Innovators",
        category: "technology",
        imageUrl: "https://example.com/images/the-innovators.jpg",
        description: "How a group of inventors created the digital revolution.",
        openUrl: "https://example.com/books/the-innovators",
        downloadUrl: "https://example.com/downloads/the-innovators.pdf",
    },
    {
        id: 5,
        title: "World War II: A Complete History",
        category: "history",
        imageUrl: "https://example.com/images/world-war-ii.jpg",
        description: "An in-depth account of World War II events and impact.",
        openUrl: "https://example.com/books/world-war-ii",
        downloadUrl: "https://example.com/downloads/world-war-ii.pdf",
    },
    {
        id: 6,
        title: "1984",
        category: "fiction",
        imageUrl: "https://example.com/images/1984.jpg",
        description: "George Orwell's dystopian novel about totalitarianism.",
        openUrl: "https://example.com/books/1984",
        downloadUrl: "https://example.com/downloads/1984.pdf",
    },
    {
        id: 7,
        title: "Clean Code",
        category: "technology",
        imageUrl: "https://example.com/images/clean-code.jpg",
        description: "A guide to writing clean and maintainable code by Robert C. Martin.",
        openUrl: "https://example.com/books/clean-code",
        downloadUrl: "https://example.com/downloads/clean-code.pdf",
    },
];
export default function LessonComponent() {
    const [bookCategory] = useState(Object.entries(BookCategory));
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const activeCategory = searchParams.get("category") || "all";
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            setSearchParams({q: query, category: activeCategory}); // Sertakan kategori saat mencari
        } else {
            setSearchParams({category: activeCategory});
        }
    };
    const filteredBooks = books.filter((book) => {
        const matchesCategory = activeCategory === "all" ? true : book.category === activeCategory;
        const matchesSearch = searchQuery.trim()
            ? book.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });
    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-start items-center">
                <h1 className="w-1/6">Lesson Book</h1>
                <SearchInput onSearch={handleSearch}/> {/* Panggil komponen input */}
            </div>
            <div className="flex flex-wrap gap-2">
                {bookCategory.map(([key, value]) => (
                    <Button
                        key={key}
                        className={`border-none shadow-none bg-transparent hover:bg-secondary/80 text-sidebar-secondary
                            ${activeCategory === key ? "bg-secondary text-sidebar-secondary" : ""}`}
                        variant="default"
                        onClick={() => setSearchParams({category: key, q: searchQuery})}
                    >
                        {value}
                    </Button>
                ))}
            </div>

            {/* Render Buku */}
            <div className="mt-5 justify-center item-center flex flex-col gap-5 ">
                <h2 className="text-lg font-semibold">Books:</h2>
                {filteredBooks.length > 0 ? (
                    <div
                        className=" flex max-md:flex-col gap-2 justify-start max-md:items-center flex-wrap ">
                        {filteredBooks.map((book) => (
                            <BookCard
                                key={book.id}
                                title={book.title}
                                imageUrl={book.imageUrl}
                                description={book.description}
                                openUrl={book.openUrl}
                                downloadUrl={book.downloadUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No books available for this category.</p>
                )}
            </div>
        </div>
    );
}
