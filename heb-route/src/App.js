import Router from './routers/Router';
import { AuthProvider } from './providers/AuthProvider';
import { UserInformationProvider } from './providers/UserInformationProvider';
import { ProductProvider } from './providers/ProductProvider';
import { ListProvider } from './providers/ListProvider';

import './stylesheets/Global.css';

function App() {
  return (
    <AuthProvider>
      <UserInformationProvider>
        <ProductProvider>
          <ListProvider>
            <Router/>
          </ListProvider>
        </ProductProvider>
      </UserInformationProvider>
    </AuthProvider>
  );
}

export default App;