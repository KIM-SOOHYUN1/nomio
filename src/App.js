
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './admin/AdminPage.js';
import PlanerPage from './planer/PlanerPage.js';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/planer/*" element={<PlanerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
