import { useEffect, useState } from 'react';
import ProfileForm from './components/ProfileForm.jsx';
import JobStatusCard from './components/JobStatusCard.jsx';
import ProfileView from './components/ProfileView.jsx';
import { createScrapeJob, fetchProfile, fetchScrapeJob } from './lib/api.js';

const terminalStatuses = new Set(['SUCCEEDED', 'FAILED']);

export default function App() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [waitForCompletion, setWaitForCompletion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [profilePayload, setProfilePayload] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!job?.id || terminalStatuses.has(job.status)) {
      return undefined;
    }

    const interval = window.setInterval(async () => {
      try {
        const nextJob = await fetchScrapeJob(job.id);
        setJob(nextJob);
      } catch (pollError) {
        setError(pollError.message);
      }
    }, 2500);

    return () => window.clearInterval(interval);
  }, [job]);

  useEffect(() => {
    if (!job?.id || job.status !== 'SUCCEEDED' || !job.profileAvailable) {
      return;
    }

    fetchProfile(job.id)
      .then(setProfilePayload)
      .catch((profileError) => setError(profileError.message));
  }, [job]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setProfilePayload(null);

    try {
      const createdJob = await createScrapeJob(linkedinUrl, waitForCompletion);
      setJob(createdJob);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRefresh() {
    if (!job?.id) {
      return;
    }

    try {
      const nextJob = await fetchScrapeJob(job.id);
      setJob(nextJob);
    } catch (refreshError) {
      setError(refreshError.message);
    }
  }

  return (
    <main className="app-shell">
      <div className="backdrop"></div>
      <div className="content">
        <ProfileForm
          value={linkedinUrl}
          onChange={setLinkedinUrl}
          onSubmit={handleSubmit}
          loading={submitting}
          waitForCompletion={waitForCompletion}
          onToggleWait={() => setWaitForCompletion((current) => !current)}
        />

        {error ? <div className="alert error-text">{error}</div> : null}

        <JobStatusCard job={job} onRefresh={handleRefresh} />
        <ProfileView payload={profilePayload} />
      </div>
    </main>
  );
}
