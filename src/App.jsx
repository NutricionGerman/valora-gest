import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Anamnesis from './pages/Anamnesis';
import ValoracionClinica from './pages/ValoracionClinica';
import ParametrosBioquimicos from './pages/ParametrosBioquimicos';
import Antropometria from './pages/Antropometria';
import HistoriaAlimentaria from './pages/HistoriaAlimentaria';
import Diagnostico from './pages/Diagnostico';
import IntervencionNutricional from './pages/IntervencionNutricional';
import Reportes from './pages/Reportes';
import Pacientes from './pages/Pacientes';

const ProtectedRoute = ({ children }) => {
  const patientId = localStorage.getItem('current_paciente_id');
  const location = useLocation();

  if (!patientId && location.pathname !== '/pacientes') {
    return <Navigate to="/pacientes" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pacientes" element={<Pacientes />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="anamnesis" element={<Anamnesis />} />
          <Route path="valoracion-clinica" element={<ValoracionClinica />} />
          <Route path="parametros-bioquimicos" element={<ParametrosBioquimicos />} />
          <Route path="antropometria" element={<Antropometria />} />
          <Route path="historia-alimentaria" element={<HistoriaAlimentaria />} />
          <Route path="diagnostico" element={<Diagnostico />} />
          <Route path="intervencion-nutricional" element={<IntervencionNutricional />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
