import { useEffect, useState } from "react";
import HeroBanner from "../../components/home/HeroBanner";
import BookCard from "../../components/books/BookCard";
import { getBooks } from "../../services/bookService";

function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();

      console.log("Full Response:", res);
      console.log("Response data:", res.data);
      console.log("Books:", res.data.data);

      setBooks(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <HeroBanner />

      <h2 className="mb-4">🔥 Sách nổi bật</h2>

      <div className="row">
        {books.map((book) => (
          <div className="col-lg-3 col-md-6 mb-4" key={book.id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
