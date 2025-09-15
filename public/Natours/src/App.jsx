import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import GlobalStyle from './GlobalStyle.js';
import AppLayout from './Jsx/AppLayout.jsx';
import Overview from './Jsx/Overview.jsx';
import Tour from './Jsx/Tour.jsx';
import Login from './Jsx/Login.jsx';
import LoginProvider from './Jsx/LoginContext.jsx';
import { CookiesProvider } from 'react-cookie';
import Error from './Jsx/Error.jsx';
import Account from './Jsx/Account.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5,
    },
  },
});

function App() {
  return (
    <CookiesProvider>
      <LoginProvider>
        <QueryClientProvider client={queryClient}>
          <GlobalStyle />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate replace to="/overview" />} />
                <Route path="overview" element={<Overview />} />
                <Route path="tour/:id" element={<Tour />} />
                <Route path="login" element={<Login />} />
                <Route path="me" element={<Account />} />
              </Route>
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: '8px' }}
            toastOptions={{
              success: {
                duration: 3000,
                style: {
                  color: '#55c57a',
                },
              },
              error: {
                duration: 5000,
                style: {
                  color: 'red',
                },
              },
              style: {
                fontSize: '16px',
                maxWidth: '500px',
                padding: '16px 24px',
                backgroundColor: 'f7f7f7',
                // Color: 'f7f7f7',
              },
            }}
          />
        </QueryClientProvider>
      </LoginProvider>
    </CookiesProvider>
  );
}

export default App;
