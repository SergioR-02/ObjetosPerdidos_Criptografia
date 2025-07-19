import React, { useState, useEffect } from 'react';
import './ObjectDetails.scss';
import ObjectCard from '../../organisms/objectCard/ObjectCard';
import Header from '../../organisms/header/Header';
import { Footer } from '../../organisms/footer/Footer';
import { getFilteredObjects } from '../../utilities/getObjectId';
import { useUserStore } from '../../store/userStore';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import BasicLayout from '../layout/BasicLayout';
import API_BASE_URL from '../../config/api.js';

export default function ObjectDetails() {
  const { id } = useParams();
  const { userId } = useUserStore();
  const [object, setObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const data = await getFilteredObjects(userId, id);
        setObject(data);
        console.log(data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchObject();
  }, [id, userId]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar el objeto: {error.message}</div>;
  }

  if (!object) {
    return <div>No se encontró el objeto</div>;
  }

  return (
    <>
      <Header />
      <BasicLayout>

        <div className='object-details-container'>
          <ObjectCard
            imageSrc={
              object.image_url
                ? `${API_BASE_URL}/user/${userId}/images/${object.image_url}`
                : '../../Icons/Default_Icon.svg'
            }
            imageAlt='Imagen del objeto'
            title={object.title || 'Sin título'}
            category={object.category || 'Sin categoría'}
            state={object.status || 'Estado desconocido'}
            location={object.location || 'Ubicación desconocida'}
            date={
              object.date_lost_or_found
                ? dayjs(object.date_lost_or_found).format('DD/MM/YYYY')
                : 'Fecha desconocida'
            }
            description={object.description || 'Sin descripción'}
            contactInfo={object.contact_method || 'Sin información de contacto'}
          />
        </div>
      </BasicLayout>
      <Footer />
    </>
  );
}
