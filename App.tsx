import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { NewReviewPage } from './pages/NewReviewPage';
import { ReviewDashboardPage } from './pages/ReviewDashboardPage';

const App: React.FC = () => {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/reviews/new" element={<NewReviewPage />} />
          <Route path="/reviews/:id" element={<ReviewDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
};

export default App;