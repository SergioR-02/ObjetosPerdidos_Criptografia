import Header from '../../organisms/header/Header';
import BasicInformation from '../../organisms/basicInformation/BasicInformation';
import { Footer } from '../../organisms/footer/Footer';
import { useUserStore } from '../../store/userStore';
import { Navigate } from 'react-router-dom';

const LandPage = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Si el usuario ya está autenticado, redirigir a home
  if (isAuthenticated) {
    return <Navigate to='/home' replace />;
  }
  return (
    <>
      <Header />
      <BasicInformation />
      <Footer />
    </>
  );
};

export default LandPage;
