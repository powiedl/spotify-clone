import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/home/Homepage';
import AuthCallbackPage from './pages/home/auth-callback/AuthCallbackPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/auth-callback' element={<AuthCallbackPage />} />
      </Routes>
    </>
  );
}

export default App;
