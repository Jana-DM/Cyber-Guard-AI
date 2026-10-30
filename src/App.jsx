import { AppProvider, useApp } from './context/AppContext';
import { DemoProvider } from './context/DemoContext';
import Login from './components/auth/Login';
import AppShell from './components/shell/AppShell';

function Root() {
  const { state } = useApp();
  return state.isAuthenticated ? <AppShell /> : <Login />;
}

export default function App() {
  return (
    <AppProvider>
      <DemoProvider>
        <Root />
      </DemoProvider>
    </AppProvider>
  );
}