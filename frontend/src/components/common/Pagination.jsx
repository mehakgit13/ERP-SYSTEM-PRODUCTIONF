const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderTop: '1px solid #1E2A40',
    }}>
      <span style={{ fontSize: 12, color: '#475569' }}>
        Showing {from}–{to} of {total} results
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          className="btn btn-ghost"
          style={{ padding: '5px 12px', fontSize: 12 }}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >← Prev</button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              className={`btn ${p === page ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '5px 10px', fontSize: 12, minWidth: 32 }}
              onClick={() => onPageChange(p)}
            >{p}</button>
          );
        })}
        <button
          className="btn btn-ghost"
          style={{ padding: '5px 12px', fontSize: 12 }}
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >Next →</button>
      </div>
    </div>
  );
};

export default Pagination;
