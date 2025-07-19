import './Loading.scss';
import BasicLayout from '../layout/BasicLayout';
import Footer from '../../organisms/footer/Footer';

export default function Loading() {
  return (
    <>
      <BasicLayout>
        <div className='loading'>
          <div className='loading__spinner'>
            <h1 className='loading__title'>Cargando...</h1>
          </div>
        </div>
      </BasicLayout>
      <Footer />
    </>
  );
}
