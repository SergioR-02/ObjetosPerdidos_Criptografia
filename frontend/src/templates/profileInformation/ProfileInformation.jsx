import './ProfileInformation.scss';
import Header from '../../organisms/header/Header';
import { Footer } from '../../organisms/footer/Footer';
import MainProfileInformation from '../../organisms/mainProfileInformation/MainProfileInformation';

export default function ProfileInformation() {
  return (
    <>
      <Header />
      <MainProfileInformation />
      <Footer />
    </>
  );
}
