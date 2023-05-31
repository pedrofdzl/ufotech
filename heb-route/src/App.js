import Router from './routers/Router';
import { AuthProvider } from './providers/AuthProvider';
import { UserInformationProvider } from './providers/UserInformationProvider';
import { ProductProvider } from './providers/ProductProvider';
import { ListProvider } from './providers/ListProvider';
import { ModalProvider } from './providers/ModalProvider';
import { NotificationProvider } from './providers/NotificationProvider';

// Error Boundary
import ErrorBoundary from './errorhandling/errorboundary';

import './stylesheets/Global.css';

function App() {
  return (
    <ErrorBoundary>
    <NotificationProvider>
      <AuthProvider>
        <UserInformationProvider>
          <ProductProvider>
            <ListProvider>
              <ModalProvider>
                <Router />
              </ModalProvider>
            </ListProvider>
          </ProductProvider>
        </UserInformationProvider>
      </AuthProvider>
    </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
