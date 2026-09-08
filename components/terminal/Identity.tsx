import { progression } from '@/data/portfolio';
export function Identity() {
  return (
    <section className="identity" aria-label="About Jimmy Jose">
      <div className="identity-heading">
        <div>
          <p className="eyebrow">HELLO, WORLD. I’M</p>
          <h1>
            Jimmy Jose<span className="name-dot">.</span>
          </h1>
        </div>
        <span className="identity-index" aria-hidden="true">
          [ JJ / 01 ]
        </span>
      </div>
      <h2>Senior Software Engineer</h2>
      <p className="specialties">
        BACKEND <span> / </span> FULL STACK <span> / </span> MOBILE
      </p>
      <p className="intro">
        10 years building production software across
        <br className="desktop-break" /> backend, full stack and mobile.
      </p>
      <p className="tech-line">
        Go <b>·</b> Kotlin <b>·</b> Next.js <b>·</b> Distributed Systems{' '}
        <b>·</b> AI
      </p>
      <div className="ownership">
        <span className="comment-mark">{'//'}</span>
        <div>
          <p>I build products end-to-end.</p>
          <p className="ownership-flow">
            architecture <span>→</span> development <span>→</span> deployment{' '}
            <span>→</span> production
          </p>
        </div>
      </div>
      <div className="progression" aria-label="Career progression">
        {progression.map((step, index) => (
          <span key={step}>
            <small>0{index + 1}</small>
            {step}
            {index < progression.length - 1 && <i aria-hidden="true">→</i>}
          </span>
        ))}
      </div>
    </section>
  );
}
