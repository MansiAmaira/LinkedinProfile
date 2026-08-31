export default function ProfileForm({
  value,
  onChange,
  onSubmit,
  loading,
  waitForCompletion,
  onToggleWait,
}) {
  return (
    <section className="panel hero-panel">
      <div className="eyebrow">LinkedIn Profile Extraction</div>
      <h1>Turn a LinkedIn profile URL into structured data you can inspect, store, or reuse.</h1>
      <p className="lede">
        This app starts an authenticated scrape job, reads the target profile, and returns a normalized
        response with headline, location, about, experience, education, skills, certifications, languages,
        and raw JSON output for downstream systems.
      </p>
      <div className="feature-grid">
        <article className="feature-card">
          <strong>Job-based workflow</strong>
          <p>Submit once, poll status safely, and fetch results when the scrape completes.</p>
        </article>
        <article className="feature-card">
          <strong>Structured output</strong>
          <p>Profile sections are normalized into predictable JSON instead of loose page HTML.</p>
        </article>
        <article className="feature-card">
          <strong>Built for delivery</strong>
          <p>The UI, API, persistence, and container setup are ready for local runs or hosted deployment.</p>
        </article>
      </div>

      <form className="profile-form" onSubmit={onSubmit}>
        <label htmlFor="linkedin-url">LinkedIn profile URL</label>
        <div className="form-row">
          <input
            id="linkedin-url"
            type="url"
            placeholder="https://www.linkedin.com/in/your-target-profile"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Start Scrape'}
          </button>
        </div>

        <label className="checkbox">
          <input type="checkbox" checked={waitForCompletion} onChange={onToggleWait} />
          Wait for completion in the initial request
        </label>
      </form>
    </section>
  );
}
