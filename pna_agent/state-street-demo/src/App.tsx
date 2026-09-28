import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Layout } from './components/Layout';
import { PNAViewer } from './pages/PNAViewer';
import { FundInsights } from './pages/FundInsights';
import { FundDetails } from './pages/FundDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/pnaviewer" replace />} />
            <Route path="pnaviewer" element={<PNAViewer />} />
            <Route path="fund-insights" element={<FundInsights />} />
            <Route path="fund-details/:id" element={<FundDetails />} />
            {/* Catch all for other sidebar links */}
            <Route path="*" element={<div style={{ padding: 20 }}>Page under construction. Please use PNA Viewer.</div>} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
