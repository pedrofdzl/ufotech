import Router from './routers/Router';
import { AuthProvider } from './providers/AuthProvider';
import { UserInformationProvider } from './providers/UserInformationProvider';
import { ProductProvider } from './providers/ProductProvider';

import './stylesheets/Global.css';

function App() {
  return (
    <AuthProvider>
      <UserInformationProvider>
        <ProductProvider>
          <Router/>
        </ProductProvider>
      </UserInformationProvider>
    </AuthProvider>
  );
}

export default App;