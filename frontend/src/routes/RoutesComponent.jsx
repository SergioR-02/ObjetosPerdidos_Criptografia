import { Routes, Route } from 'react-router-dom';
import LandPage from '../templates/landPage/LandPage';
import { BrowserRouter } from 'react-router-dom';
import Login from '../templates/login/Login';
import Home from '../templates/home/Home';
import Register from '../templates/register/Register';
import ObjectDetails from '../templates/objectDetails/ObjectDetails';
import FormReport from '../templates/formReports/FormReports';
import ProfileInformation from '../templates/profileInformation/ProfileInformation';
import SearchReports from '../templates/searchReports/SearchReports';
import TwoFactorSetupPage from '../templates/twoFactorSetup/TwoFactorSetupPage';
import PrivateRoute from './privateRoute';
import { useEffect, useState } from 'react';
import { checkAuthStatus } from '../utilities/auth';
import { useUserStore } from '../store/userStore';
import Loading from '../templates/loading/Loading';
//saber cual es la url

const RoutesComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const setIsAuthenticated = useUserStore((state) => state.setIsAuthenticated);
  const pathname = location.pathname;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Solo verificar autenticación si estamos en una ruta protegida
        const protectedRoutes = [
          '/home',
          '/profile',
          '/reports',
          '/add-report',
          '/setup-2fa',
        ];
        const currentPath = window.location.pathname;

        if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
          // Solo verificar autenticación para rutas protegidas
          const isAuth = await checkAuthStatus();
          setIsAuthenticated(isAuth);
        } else {
          // Para rutas públicas, simplemente establecer como no autenticado sin verificar
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('error', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/objectDetails/:id' element={<ObjectDetails />} />
          <Route path='/profileInformation' element={<ProfileInformation />} />
          <Route path='/setup-2fa' element={<TwoFactorSetupPage />} />
          <Route path='/report' element={<FormReport />} />
          <Route path='/editar/:id' element={<FormReport />} />
          <Route path='/searchReports' element={<SearchReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;
