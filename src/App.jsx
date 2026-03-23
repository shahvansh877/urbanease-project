import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext'; // Ex No: 3b — useContext

function App() {
  return (
    // AuthProvider wraps the entire app so any component can call useAuth()
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
