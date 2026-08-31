function renderList(items, renderItem) {
  if (!items?.length) {
    return <p className="muted">No items extracted.</p>;
  }

  return <div className="list-grid">{items.map(renderItem)}</div>;
}

export default function ProfileView({ payload }) {
  if (!payload?.profile) {
    return null;
  }

  const { profile } = payload;

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Extracted Profile</div>
          <h2>{profile.name || 'Unnamed profile'}</h2>
          <p className="lede compact">{profile.headline || 'No headline extracted'}</p>
        </div>
        {profile.profileImageUrl ? (
          <img className="avatar" src={profile.profileImageUrl} alt={profile.name || 'Profile'} />
        ) : null}
      </div>

      <div className="profile-meta">
        <span>{profile.location || 'Location unavailable'}</span>
        <span>{profile.normalizedUrl}</span>
      </div>

      <div className="section-stack">
        <section>
          <h3>About</h3>
          <p>{profile.about || 'No about section extracted.'}</p>
        </section>

        <section>
          <h3>Experience</h3>
          {renderList(profile.experience, (item, index) => (
            <article className="list-card" key={`${item.title}-${index}`}>
              <strong>{item.title}</strong>
              <span>{item.company}</span>
              <span>{item.dateRange}</span>
              <span>{item.location}</span>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section>
          <h3>Education</h3>
          {renderList(profile.education, (item, index) => (
            <article className="list-card" key={`${item.school}-${index}`}>
              <strong>{item.school}</strong>
              <span>{item.degree}</span>
              <span>{item.fieldOfStudy}</span>
              <span>{item.dateRange}</span>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section>
          <h3>Skills</h3>
          {renderList(profile.skills, (item, index) => (
            <article className="list-card" key={`${item.name}-${index}`}>
              <strong>{item.name}</strong>
              <span>{item.endorsements}</span>
            </article>
          ))}
        </section>

        <section>
          <h3>Certifications</h3>
          {renderList(profile.certifications, (item, index) => (
            <article className="list-card" key={`${item.name}-${index}`}>
              <strong>{item.name}</strong>
              <span>{item.issuer}</span>
              <span>{item.issueDate}</span>
              <p>{item.credentialId}</p>
            </article>
          ))}
        </section>

        <section>
          <h3>Languages</h3>
          {renderList(profile.languages, (item, index) => (
            <article className="list-card" key={`${item.name}-${index}`}>
              <strong>{item.name}</strong>
              <span>{item.proficiency}</span>
            </article>
          ))}
        </section>

        <section>
          <h3>Raw JSON</h3>
          <pre className="json-block">{JSON.stringify(payload, null, 2)}</pre>
        </section>
      </div>
    </section>
  );
}
