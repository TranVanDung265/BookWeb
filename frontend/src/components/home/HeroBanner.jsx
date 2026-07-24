import "./HeroBanner.css";

function HeroBanner() {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1>📚 Summer Book Sale</h1>

        <p>Giảm giá lên đến 30% cho hàng trăm đầu sách.</p>

        <button>Mua ngay</button>
      </div>

      <img
        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800"
        alt="Books"
      />
    </div>
  );
}

export default HeroBanner;
