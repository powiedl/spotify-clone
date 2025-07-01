import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/home/Homepage';
import AuthCallbackPage from './pages/auth-callback/AuthCallbackPage';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route
          path='/sso-callback'
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={'/auth-callback'}
            />
          }
        />
        <Route path='/auth-callback' element={<AuthCallbackPage />} />
      </Routes>
    </>
  );
}

export default App;
