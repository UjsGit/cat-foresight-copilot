import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { DemoReplayToolbar } from './components/layout/DemoReplayToolbar';
import { CriticalAlertModal } from './components/layout/CriticalAlertModal';

import { LoginPage } from './pages/LoginPage';
import { PreStartCheckPage } from './pages/PreStartCheckPage';
import { LiveCabPage } from './pages/LiveCabPage';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { SafetyCenterPage } from './pages/SafetyCenterPage';
import { CameraVisionPage } from './pages/CameraVisionPage';
import { MachineHealthPage } from './pages/MachineHealthPage';
import { CopilotPage } from './pages/CopilotPage';
import { TrainingHubPage } from './pages/TrainingHubPage';
import { ShiftSummaryPage } from './pages/ShiftSummaryPage';
import { IncidentHistoryPage } from './pages/IncidentHistoryPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-cat-black flex flex-col font-sans text-slate-100">
          <Header />
          <DemoReplayToolbar />
          <Navigation />

          <main className="flex-1 pb-12">
            <Routes>
              <Route path="/" element={<Navigate to="/live-cab" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/pre-start" element={<PreStartCheckPage />} />
              <Route path="/live-cab" element={<LiveCabPage />} />
              <Route path="/task" element={<TaskDetailsPage />} />
              <Route path="/safety" element={<SafetyCenterPage />} />
              <Route path="/camera-vision" element={<CameraVisionPage />} />
              <Route path="/machine-health" element={<MachineHealthPage />} />
              <Route path="/copilot" element={<CopilotPage />} />
              <Route path="/training" element={<TrainingHubPage />} />
              <Route path="/shift-summary" element={<ShiftSummaryPage />} />
              <Route path="/incidents" element={<IncidentHistoryPage />} />
              <Route path="*" element={<Navigate to="/live-cab" replace />} />
            </Routes>
          </main>

          <CriticalAlertModal />
        </div>
      </Router>
    </AppProvider>
  );
};
