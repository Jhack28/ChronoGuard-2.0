import React, { useState, useEffect } from 'react';
import logoCHG from '../components/img/logoCHGcircul.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function SecretariaPanel() {
  const [empleados, setEmpleados] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [showAsistencia, setShowAsistencia] = useState(false);
  const [showReporte, setShowReporte] = useState(false);
  const [formAsistencia, setFormAsistencia] = useState({
    id: '', nombre: '', entrada: '', salida: '', estado: ''
  });
  const [formReporte, setFormReporte] = useState({
    fechaInicio: '', fechaFin: '', empleado: '', estado: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const idUsuario = localStorage.getItem("id_usuario");
    if (!idUsuario) navigate("/", { replace: true });
  }, [navigate]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:5170/usuarios");
      const data = await response.json();
      setEmpleados(data
        .filter(u => u.Rol === 3 || u.Rol === "3") // Solo empleados
        .map(u => ({
          id: u.ID_Usuario,
          numero_de_documento: u.Numero_de_Documento || '',
          nombre: u.Nombre,
          email: u.Correo,
          departamento: u.Departamento || ''
        })));
    } catch (error) {
      alert("Error al obtener usuarios: " + error.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // --- Asistencia ---
  const handleAsistenciaChange = (e) => {
    const { id, value } = e.target;
    setFormAsistencia(prev => ({
      ...prev,
      [id.replace('input', '').replace('Asistencia', '').toLowerCase()]: value
    }));
  };

  const handleAsistenciaSubmit = (e) => {
    e.preventDefault();
    setAsistencias([...asistencias, formAsistencia]);
    setShowAsistencia(false);
    setFormAsistencia({ id: '', nombre: '', entrada: '', salida: '', estado: '' });
  };

  // --- Reporte ---
  const handleReporteChange = (e) => {
    const { id, value } = e.target;
    setFormReporte(prev => ({
      ...prev,
      [id.replace('input', '').replace('Reporte', '').toLowerCase()]: value
    }));
  };

  const handleReporteSubmit = (e) => {
    e.preventDefault();
    alert("Reporte generado (simulado)");
    setShowReporte(false);
    setFormReporte({ fechaInicio: '', fechaFin: '', empleado: '', estado: '' });
  };

  return (
    <div className='contenedor'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <img src={logoCHG} alt="Logo" style={{ width: 40, marginRight: 10 }} />
          <a className="navbar-brand" href="#">ChronoGuard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="/notificaciones"><i className="fas fa-bell"></i></a></li>
              <li className="nav-item"><a className="nav-link" href="#empleados">Empleados</a></li>
              <li className="nav-item"><a className="nav-link" href="#asistencia">Asistencia</a></li>
              <li className="nav-item"><a className="nav-link" href="#reportes">Reportes</a></li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  style={{ color: 'white', textDecoration: 'none' }}
                  onClick={() => { localStorage.removeItem("id_usuario"); navigate("/", { replace: true }); }}
                >
                  Salir
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h1 className="text-center mb-4"
          style={{
            color: 'black',
            background: 'linear-gradient(135deg, #36dee4c2 0%,rgb(46, 145, 175) 100%)',
            padding: '10px',
            borderRadius: '5px'
          }}>Panel de Secretaria</h1>

        {/* Empleados */}
        <section id="empleados" className="mb-5">
          <h2>Empleados Registrados</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.numero_de_documento}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.departamento || "N/A"}</td>
                  <td>{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Asistencia */}
        <section id="asistencia" className="mb-5">
          <h2>Control de Asistencia</h2>
          <button className="btn btn-success mb-3" onClick={() => setShowAsistencia(true)}>Registrar Asistencia</button>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Entrada</th><th>Salida</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a, i) => (
                <tr key={i}>
                  <td>{a.id}</td><td>{a.nombre}</td><td>{a.entrada}</td><td>{a.salida}</td><td>{a.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Modal asistencia */}
        {showAsistencia && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ background: 'linear-gradient(135deg,rgba(125, 240, 255, 0.97) 0%,rgb(29, 113, 146) 100%)' }}>
                <div className="modal-header">
                  <h5 className="modal-title">Registrar Asistencia</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAsistencia(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAsistenciaSubmit}>
                    <div className="mb-3"><label>ID</label><input type="text" className="form-control" id="inputIdAsistencia" value={formAsistencia.id} onChange={handleAsistenciaChange} required /></div>
                    <div className="mb-3"><label>Nombre</label><input type="text" className="form-control" id="inputNombreAsistencia" value={formAsistencia.nombre} onChange={handleAsistenciaChange} required /></div>
                    <div className="mb-3"><label>Entrada</label><input type="time" className="form-control" id="inputEntradaAsistencia" value={formAsistencia.entrada} onChange={handleAsistenciaChange} required /></div>
                    <div className="mb-3"><label>Salida</label><input type="time" className="form-control" id="inputSalidaAsistencia" value={formAsistencia.salida} onChange={handleAsistenciaChange} required /></div>
                    <div className="mb-3">
                      <label>Estado</label>
                      <select className="form-select" id="inputEstadoAsistencia" value={formAsistencia.estado} onChange={handleAsistenciaChange} required>
                        <option value="">Seleccione estado</option>
                        <option value="Puntual">Puntual</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Ausente">Ausente</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Registrar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reportes */}
        <section id="reportes" className="mb-5">
          <h2>Generación de Reportes</h2>
          <p>Genera reportes sobre asistencia del personal.</p>
          <button className="btn btn-info" onClick={() => setShowReporte(true)}>Generar Reporte</button>
        </section>

        {/* Modal reporte */}
        {showReporte && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Generar Reporte</h5>
                  <button type="button" className="btn-close" onClick={() => setShowReporte(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleReporteSubmit}>
                    <div className="mb-3"><label>Fecha Inicio</label><input type="date" className="form-control" id="inputFechaInicio" value={formReporte.fechaInicio} onChange={handleReporteChange} required /></div>
                    <div className="mb-3"><label>Fecha Fin</label><input type="date" className="form-control" id="inputFechaFin" value={formReporte.fechaFin} onChange={handleReporteChange} required /></div>
                    <div className="mb-3"><label>Empleado (Opcional)</label><input type="text" className="form-control" id="inputEmpleado" value={formReporte.empleado} onChange={handleReporteChange} /></div>
                    <div className="mb-3">
                      <label>Estado (Opcional)</label>
                      <select className="form-select" id="inputEstado" value={formReporte.estado} onChange={handleReporteChange}>
                        <option value="">Todos</option>
                        <option value="Puntual">Puntual</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Ausente">Ausente</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Generar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-dark text-center text-white py-3">
        <p>&copy; 2024 ChronoGuard. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default SecretariaPanel;
