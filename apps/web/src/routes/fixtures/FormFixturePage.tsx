export function FormFixturePage() {
  return (
    <div className="fixture-page">
      <main>
        <h1>Checkout</h1>
        <form>
          <label>
            Email
            <input type="email" name="email" autoComplete="email" />
          </label>
          <label>
            Card number
            <input type="text" name="card-number" autoComplete="cc-number" />
          </label>
          <label>
            Password
            <input type="password" name="password" autoComplete="current-password" />
          </label>
          <button type="submit">Pay now</button>
        </form>
      </main>
    </div>
  );
}
