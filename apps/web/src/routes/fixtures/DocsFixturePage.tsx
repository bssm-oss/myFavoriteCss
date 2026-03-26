export function DocsFixturePage() {
  return (
    <div className="fixture-page">
      <aside>
        <h2>Contents</h2>
        <ol>
          <li>Install</li>
          <li>Configure</li>
          <li>Deploy</li>
        </ol>
      </aside>
      <main>
        <h1>API quickstart</h1>
        <section>
          <h2>Install</h2>
          <pre><code>pnpm install morph-ui</code></pre>
        </section>
        <section>
          <h2>Configure</h2>
          <p>Set up the extension, add a provider API key, and choose your privacy defaults.</p>
        </section>
      </main>
    </div>
  );
}
