export function DashboardFixturePage() {
  return (
    <div className="fixture-page">
      <header><nav><a href="#overview">Overview</a><a href="#reports">Reports</a><a href="#alerts">Alerts</a></nav></header>
      <main id="overview">
        <h1>Revenue dashboard</h1>
        <section className="grid">
          <article className="card"><h2>MRR</h2><strong>$98,300</strong></article>
          <article className="card"><h2>Expansion</h2><strong>14%</strong></article>
          <article className="card"><h2>Churn</h2><strong>2.4%</strong></article>
        </section>
        <table>
          <thead><tr><th>Team</th><th>Pipeline</th><th>Close rate</th></tr></thead>
          <tbody>
            <tr><td>Enterprise</td><td>$420k</td><td>31%</td></tr>
            <tr><td>Growth</td><td>$180k</td><td>26%</td></tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
