export function EcommerceFixturePage() {
  return (
    <div className="fixture-page">
      <header><nav><a href="#catalog">Catalog</a><a href="#sale">Sale</a><a href="#account">Account</a></nav></header>
      <main id="catalog">
        <h1>Spring catalog</h1>
        <section className="grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <article key={index} className="card product-card">
              <h2>Product {index + 1}</h2>
              <p>Compact product summary with price and CTA.</p>
              <button>Add to cart</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
