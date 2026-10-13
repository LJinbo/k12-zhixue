import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentHomePage from './pages/student/StudentHomePage';
import MathStarMapPage from './pages/student/MathStarMapPage';
import ParentOverviewPage from './pages/parent/ParentOverviewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student" element={<StudentHomePage />} />
        <Route path="/student/math" element={<MathStarMapPage />} />
        <Route path="/parent" element={<ParentOverviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
