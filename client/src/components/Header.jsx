export default function Header({ query, onSearch }) {
  return (
    <header className="header">
      <div>
        <a className="brand" href="#"><span className="brand-mark" aria-hidden="true">J</span>JobFlow</a>
        <p className="eyebrow">YOUR CAREER, IN PROGRESS</p>
        <h1>Make your next move.</h1>
        <p className="lead">Every opportunity, from wishlist to offer. All in one place.</p>
      </div>
      <div className="search-field">
        <label htmlFor="search">Search applications</label>
        <input id="search" type="search" placeholder="Company or position…" value={query}
          onChange={event => onSearch(event.target.value)} />
      </div>
    </header>
  );
}
