function Error({ msg }) {
  return (
    <main className="main">
      <div className="error">
        <div className="error__title">
          <h2 className="heading-secondary heading-secondary--error">
            {msg ? 'Something went wrong!' : 'Route not found'}
          </h2>
          <h2 className="error__emoji">💥💥💥</h2>
        </div>
        {msg && <div className="error__msg">{msg}</div>}
      </div>
    </main>
  );
}

export default Error;
