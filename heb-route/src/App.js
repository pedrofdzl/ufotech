import Router from './routers/Router';
import { AuthProvider } from './providers/AuthProvider';

import './stylesheets/Global.css';

function App() {
  return (
    <AuthProvider>
      <Router/>
    </AuthProvider>
  );
}

export default App;
