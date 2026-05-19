import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">✝</div>
          <div className="landing-logo-text">
            <h1>Movimiento Franciscano</h1>
            <span>Pedagogía Espiritual de la Santísima Trinidad</span>
          </div>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-secondary">Iniciar sesión</Link>
          <Link to="/registro" className="btn btn-primary">Registrarse</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h2>Camino de formación espiritual</h2>
          <p>
            Plataforma integral para el crecimiento en la fe, el seguimiento pedagógico
            de tu camino espiritual, la formación en comunidad y el acceso a recursos
            del Movimiento Franciscano.
          </p>
          <div className="landing-hero-actions">
            <Link to="/registro" className="btn btn-gold">Comenzar mi camino</Link>
            <Link to="/login" className="btn btn-secondary">Acceder a la plataforma</Link>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">✦</div>
          <h3>Ficha Pedagógica</h3>
          <p>Mide y registra tu avance espiritual en cada etapa del camino de fe.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">▶</div>
          <h3>Contenidos formativos</h3>
          <p>Videos, presentaciones, documentos y esquemas para tu formación.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">☘</div>
          <h3>Grupos de Pastoreo</h3>
          <p>Comunidad, esquemas de sesión y acompañamiento en grupo.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✉</div>
          <h3>Comunicación interna</h3>
          <p>Anuncios y mensajería para mantenerte conectado con el movimiento.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
          <Link to="/login">Acceso administrativo</Link>
        </p>
      </footer>
    </div>
  )
}
