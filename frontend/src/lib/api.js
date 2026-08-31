const API_BASE =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080/api/v1' : '/api/v1');

export async function createScrapeJob(linkedinProfileUrl, waitForCompletion = false) {
  const response = await fetch(`${API_BASE}/scrape-jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ linkedinProfileUrl, waitForCompletion }),
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new Error(errorBody?.message || 'Failed to create scrape job');
  }

  return response.json();
}

export async function fetchScrapeJob(jobId) {
  const response = await fetch(`${API_BASE}/scrape-jobs/${jobId}`);
  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new Error(errorBody?.message || 'Failed to fetch scrape job');
  }
  return response.json();
}

export async function fetchProfile(jobId) {
  const response = await fetch(`${API_BASE}/scrape-jobs/${jobId}/profile`);
  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new Error(errorBody?.message || 'Failed to fetch extracted profile');
  }
  return response.json();
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
