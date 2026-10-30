import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useApp } from '../../context/AppContext';
import { ROUTES } from '../../constants/routes';

import Overview from '../../screens/Overview';
import ImportProject from '../../screens/ImportProject';
import Pipeline from '../../screens/Pipeline';
import ScanResults from '../../screens/ScanResults';
import Verification from '../../screens/Verification';
import GitHubScreen from '../../screens/GitHubScreen';
import AuditLog from '../../screens/AuditLog';

const SCREEN_MAP = {
  [ROUTES.OVERVIEW]: Overview,
  [ROUTES.IMPORT]: ImportProject,
  [ROUTES.PIPELINE]: Pipeline,
  [ROUTES.SCAN_RESULTS]: ScanResults,
  [ROUTES.VERIFICATION]: Verification,
  [ROUTES.GITHUB]: GitHubScreen,
  [ROUTES.AUDIT_LOG]: AuditLog,
};

export default function AppShell() {
  const { state } = useApp();
  const Screen = SCREEN_MAP[state.currentRoute] ?? Overview;

  return (
    <div className="min-h-screen bg-bgvoid bg-grid flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-5 lg:p-7">
          <Screen />
        </main>
      </div>
    </div>
  );
}