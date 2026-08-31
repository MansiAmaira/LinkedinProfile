const statusTone = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCEEDED: 'success',
  FAILED: 'error',
};

export default function JobStatusCard({ job, onRefresh }) {
  if (!job) {
    return null;
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Scrape Job</div>
          <h2>{job.id}</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <span>Status</span>
          <strong className={`status-pill ${statusTone[job.status]}`}>{job.status}</strong>
        </article>
        <article className="stat-card">
          <span>Submitted URL</span>
          <strong>{job.submittedUrl}</strong>
        </article>
        <article className="stat-card">
          <span>Normalized URL</span>
          <strong>{job.normalizedUrl}</strong>
        </article>
        <article className="stat-card">
          <span>Profile Available</span>
          <strong>{job.profileAvailable ? 'Yes' : 'No'}</strong>
        </article>
      </div>

      {job.errorMessage ? <p className="error-text">{job.errorMessage}</p> : null}
    </section>
  );
}
