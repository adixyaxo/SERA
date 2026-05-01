import React from 'react';
import SystemNavbar from '../components/Navbar/SystemNavbar';
import Card from '../components/Card/Card';
import '../design-system/tokens.css';
import '../design-system/grid.css';
import '../design-system/typography.css';
import '../styles/global.css';

const EcosystemPage = () => {
  return (
    <div className="page ecosystem-page" style={{ background: 'var(--ds-bg)', minHeight: '100vh', color: 'var(--ds-text)' }}>
      <SystemNavbar />
      <header className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="grid" style={{ alignItems: 'center' }}>
          <section className="col-12" style={{ paddingBottom: '1rem' }}>
            <h1 className="h1" style={{ margin: 0 }}>SERA Ecosystem</h1>
            <p className="body" style={{ maxWidth: '60ch' }}>
              A cohesive, system-driven experience built on a dark, futuristic aesthetic.
            </p>
          </section>

          <section className="col-12" style={{ paddingTop: '0.5rem' }}>
            <div className="card card--highlight" style={{ padding: '1.25rem' }}>
              <div className="grid" style={{ gap: '1rem' }}>
                <div className="col-md-4">
                  <div className="caption" style={{ marginBottom: '.5rem' }}>Gradient System</div>
                  <div style={{ height: '6px', borderRadius: '6px', background: 'linear-gradient(90deg, #6a7eff, #00e0ff)' }} />
                </div>
                <div className="col-md-4">
                  <div className="caption" style={{ marginBottom: '.5rem' }}>Typography System</div>
                  <div style={{ height: '6px', borderRadius: '6px', background: 'linear-gradient(90deg, #e6f0ff, #9fb3cc)' }} />
                </div>
                <div className="col-md-4">
                  <div className="caption" style={{ marginBottom: '.5rem' }}>Layout Grid</div>
                  <div style={{ height: '6px', borderRadius: '6px', background: 'linear-gradient(90deg, #8be, #4b6)' }} />
                </div>
              </div>
            </div>
          </section>

          <section className="col-12" style={{ paddingTop: '1.5rem' }}>
            <div className="grid" style={{ gap: '1.25rem' }}>
              <div className="col-md-4">
                <Card type="info" title="Unified Card" >
                  <p className="body" style={{ margin: 0 }}>Consistent border radius, padding, and shadows across all cards.</p>
                </Card>
              </div>
              <div className="col-md-4">
                <Card type="feature" title="12-Column Grid">
                  <p className="body" style={{ margin: 0 }}>A scalable grid system keeps layouts aligned and breathing easy.</p>
                </Card>
              </div>
              <div className="col-md-4">
                <Card type="highlight" title="Primary Gradients">
                  <p className="body" style={{ margin: 0 }}>2 primary gradients systematize branding and evoke mood.</p>
                </Card>
              </div>
            </div>
          </section>

          <section className="col-12" style={{ paddingTop: '2rem' }}>
            <div className="grid" style={{ gap: '1.5rem' }}>
              <div className="col-md-6">
                <h2 className="h2" id="what-sera-built-on" style={{ marginTop: 0 }}>What SERA is Built On</h2>
                <p className="body" style={{ maxWidth: '60ch' }}>
                  A carefully balanced design system that enforces consistency, readability, and a serene yet powerful visual language.
                </p>
              </div>
              <div className="col-md-6" />
              <div className="col-md-4">
                <Card type="info" title="Accessibility">
                  Accessible color contrast and keyboard navigation baked in.
                </Card>
              </div>
              <div className="col-md-4">
                <Card type="info" title="Performance">
                  Light-weight UI components with smooth transitions.
                </Card>
              </div>
              <div className="col-md-4">
                <Card type="info" title="Theming">
                  Branded gradients, consistent typography, and density controls.
                </Card>
              </div>
            </div>
          </section>
        </div>
      </header>

      <footer className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="grid" style={{ alignItems: 'center' }}>
          <div className="col-12" style={{ textAlign: 'center' }}>
            <button className="btn btn--primary" style={primaryBtnStyle}>Get Started</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple inline style for primary button
const primaryBtnStyle = {
  padding: '0.85rem 1.25rem',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.28)',
  background: 'var(--gradient-primary)',
  color: '#041226',
  fontWeight: 700,
  cursor: 'pointer',
};

export default EcosystemPage;
