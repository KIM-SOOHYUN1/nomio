
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './AdminPage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        {/* 추후 사용자 페이지 등 추가 가능 */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
