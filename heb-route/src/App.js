import Router from './routers/Router';
import { AuthProvider } from './providers/AuthProvider';
import { UserInformationProvider } from './providers/UserInformationProvider';

import './stylesheets/Global.css';

function App() {
  return (
    <AuthProvider>
      <UserInformationProvider>
        <Router/>
      </UserInformationProvider>
    </AuthProvider>
  );
}

export default App;