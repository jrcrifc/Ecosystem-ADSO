const Home = () => {
  return (
    <>
      {/* HERO */}
      <section className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold text-success">
            Laboratorio Ambiental
          </h1>
          <p className="lead mt-3">
            Sistema de Gestión y Control Ambiental para análisis,
            monitoreo y evaluación ecológica.
          </p>
          <div className="mt-4">
            <button className="btn btn-success btn-lg me-3">
              <i className="bi bi-search me-2"></i>
              Ver Servicios
            </button>
            <button className="btn btn-outline-light btn-lg">
              <i className="bi bi-envelope me-2"></i>
              Contactar
            </button>
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="fw-bold text-success mb-3">
                <i className="bi bi-building me-2"></i>
                ¿Quiénes Somos?
              </h2>
              <p className="text-muted">
                Somos un laboratorio especializado en análisis físico-químicos,
                microbiológicos y monitoreo ambiental. Nuestro objetivo es
                garantizar el cumplimiento de normativas ambientales y
                proteger los recursos naturales.
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle-fill text-success me-2"></i>Control de calidad del agua</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i>Análisis de suelos</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i>Monitoreo de aire</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i>Gestión ambiental empresarial</li>
              </ul>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1581091870627-3c6c59e4a6e3"
                alt="Laboratorio"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold text-success mb-5">
            <i className="bi bi-flask me-2"></i>
            Nuestros Servicios
          </h2>

          <div className="row text-center">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4">
                <i className="bi bi-droplet-half display-4 text-success"></i>
                <h5 className="mt-3">Análisis de Agua</h5>
                <p className="text-muted">
                  Evaluación de calidad para consumo humano e industrial.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4">
                <i className="bi bi-tree display-4 text-success"></i>
                <h5 className="mt-3">Estudio de Suelos</h5>
                <p className="text-muted">
                  Diagnóstico ambiental para agricultura y construcción.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4">
                <i className="bi bi-wind display-4 text-success"></i>
                <h5 className="mt-3">Monitoreo Ambiental</h5>
                <p className="text-muted">
                  Control de contaminación del aire y evaluación sonora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-success text-white text-center py-3">
        <div className="container">
          <p className="mb-0">
            © 2026 Laboratorio Ambiental | Sistema de Gestión Ambiental
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;