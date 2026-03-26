export function ArticleFixturePage() {
  return (
    <div className="fixture-page">
      <header><nav><a href="#main">Skip to content</a><a href="#news">News</a><a href="#topics">Topics</a></nav></header>
      <main id="main">
        <article>
          <h1>Designing calmer reading experiences on dense news pages</h1>
          <p>Long-form article text with inline links, pull quotes, a related stories block, and sticky navigation opportunities.</p>
          <section>
            <h2>Why article reader modes matter</h2>
            <p>Readers benefit when noise is reduced, typography is calmer, and the main text column becomes more legible.</p>
          </section>
          <section>
            <h2>Balancing brand and readability</h2>
            <p>Preserving strong brand identity while simplifying layout is one of the key Morph UI adaptation goals.</p>
          </section>
        </article>
        <aside>
          <h2>Related stories</h2>
          <ul>
            <li>Story one</li>
            <li>Story two</li>
            <li>Story three</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
