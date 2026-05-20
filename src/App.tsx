import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { MaterialLibrary } from './pages/MaterialLibrary';
import { MaterialDetail } from './pages/MaterialDetail';
import { CreateMaterial } from './pages/CreateMaterial';
import { SupplierManagement } from './pages/SupplierManagement';
import { Categories } from './pages/Categories';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="library" element={<MaterialLibrary />} />
            <Route path="material/:id" element={<MaterialDetail />} />
            <Route path="create" element={<CreateMaterial />} />
            <Route path="edit/:id" element={<CreateMaterial />} />
            <Route path="suppliers" element={<SupplierManagement />} />
            <Route path="categories" element={<Categories />} />
            <Route path="logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;