import './styles/main.css';
import { Routes, Route, Navigate } from 'react-router';
import { AnalystPage, GeneratorPage, HistoryPage, NotFoundPage } from '@/pages';
import { Header } from '@/shared/components';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<Navigate to="/analyst" replace />} />
        <Route path="/analyst" element={<AnalystPage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </>
  );
}

export default App;
