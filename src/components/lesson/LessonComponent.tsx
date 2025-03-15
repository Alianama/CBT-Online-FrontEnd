import {Button} from "../ui/button";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import BookCard from "@/components/lesson/BookCard";
import SearchInput from "@/components/lesson/SearchInput";
import {BookCardProps} from "@/types/types.ts";
import {getBooks} from "@/app/api/api.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {getMapel} from "@/app/api/api-cbt.ts";

const BookCategory = {
    all: "All",
    fiction: "Fiction",
    nonFiction: "Non-Fiction",
    science: "Science",
    history: "History",
    technology: "Technology",
};
export default function LessonComponent() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bookCategory] = useState(Object.entries(BookCategory));
    const [books, setBooks] = useState<BookCardProps[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const activeCategory: string = searchParams.get("category") || "all";
    const handleSearch: (query: string) => void = (query: string) => {
        setSearchQuery(query);
        if (query) {
            setSearchParams({q: query, category: activeCategory});
        } else {
            setSearchParams({category: activeCategory});
        }
    };
    const filteredBooks: BookCardProps[] = books.filter((book: BookCardProps) => {
        const matchesCategory: boolean = activeCategory === "all" ? true : book.category === activeCategory;
        const matchesSearch: boolean = searchQuery.trim()
            ? book.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const data: BookCardProps[] = await getBooks();
                setBooks(data)
            } catch (err: unknown) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }
        })();
    }, [])

    useEffect(() => {
        (async () => {
          try {
              const response = await getMapel();
              if (response){
                  const { data } = response;
                  console.log(data);
              } else {
                  console.log(response)
                  console.log("error")
              }
          } catch (error){
              console.log(error)
          }
          }

        )()
    }, []);
    if (isLoading) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[100px] w-[100%] rounded-xl"/>
                <Skeleton className="h-[50px] w-[50%] rounded-xl"/>
                <div className="flex gap-3 justify-start item-center ">
                    <Skeleton className="h-[270px] w-[250px]"/>
                    <Skeleton className="h-[270px] w-[250px]"/>
                    <Skeleton className="h-[270px] w-[250px]"/>
                    <Skeleton className="h-[270px] w-[250px]"/>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-5">
                <div className="flex justify-start items-center">
                    <h1 className="w-1/6">Lesson Book</h1>
                    <SearchInput onSearch={handleSearch}/>
                </div>
                <div className="flex flex-wrap gap-2">
                    {bookCategory.map(([key, value]) => {
                        const pastelColors = [
                            "#FF6B6B",
                            "#FFD93D",
                            "#FF5E78",
                            "#FFA45B",
                            "#00C9A7",
                            "#7F7CFF",
                            "#6BCB77",
                            "#C084FC",
                            "#FF4848",
                            "#FFB830"
                        ];
                        const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
                        return (
                            <Button
                                key={key}
                                style={activeCategory ? {color: randomColor} : {}}
                                className={`border-none shadow-none bg-transparent hover:bg-secondary/80 text-sidebar-secondary
                                ${activeCategory === key ? "bg-secondary text-sidebar-secondary" : ""}`}
                                variant="default"
                                onClick={() => setSearchParams({category: key, q: searchQuery})}
                            >
                                {value}
                            </Button>
                        );
                    })}

                </div>


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
                                    category={book.category}
                                    id={book.id}/>
                            ))}
                        </div>
                    ) : (
                        <p>No books available for this category.</p>
                    )}
                </div>
            </div>
        );
    }
}
