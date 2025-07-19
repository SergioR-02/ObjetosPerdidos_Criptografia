/* eslint-disable no-undef */
/* eslint-env jest */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ObjectDetails from '../templates/objectDetails/ObjectDetails';
import * as getObjectId from '../utilities/getObjectId';

// Mock del módulo de utilidades
jest.mock('../utilities/getObjectId', () => ({
  getFilteredObjects: jest.fn(),
}));

// Mock de los componentes
jest.mock('../organisms/header/Header', () => {
  const Header = () => <div data-testid='mock-header'>Header</div>;
  Header.displayName = 'Header';
  return Header;
});

jest.mock('../organisms/objectCard/ObjectCard', () => {
  const ObjectCard = (props) => (
    <div data-testid='mock-object-card'>
      <img
        data-testid='object-image'
        src={props.imageSrc}
        alt={props.imageAlt}
      />
      <h1 data-testid='object-title'>{props.title}</h1>
      <div data-testid='object-details'>
        <p>Categoría: {props.category}</p>
        <p>Estado: {props.state}</p>
        <p>Ubicación: {props.location}</p>
        <p>Fecha: {props.date}</p>
        <p>Descripción: {props.description}</p>
        <p>Contacto: {props.contactInfo}</p>
      </div>
      <button data-testid='claim-button'>Reclamar Objeto</button>
    </div>
  );
  ObjectCard.displayName = 'ObjectCard';
  return ObjectCard;
});

jest.mock('../organisms/footer/Footer', () => {
  const Footer = () => <div data-testid='mock-footer'>Footer</div>;
  Footer.displayName = 'Footer';
  return { Footer };
});

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?id=1',
  }),
}));

// Mock del store de usuario
jest.mock('../store/userStore', () => ({
  useUserStore: () => ({
    userId: '123',
  }),
}));

describe('ObjectDetails Component', () => {
  const mockObject = {
    title: 'LLaves de toallin',
    category: 'llaves',
    status: 'Perdido',
    location: 'Biblioteca',
    date_lost_or_found: '2024-03-20',
    description: 'Llaves perdidas',
    contact_method: 'email@test.com',
    image_url: 'test.jpg',
  };

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    // Configurar el mock para que tarde en resolver
    getObjectId.getFilteredObjects.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockObject), 100)),
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <ObjectDetails />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('renders header and footer after loading', async () => {
    getObjectId.getFilteredObjects.mockResolvedValue(mockObject);

    await act(async () => {
      render(
        <BrowserRouter>
          <ObjectDetails />
        </BrowserRouter>,
      );
    });

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('renders object card with details after loading', async () => {
    getObjectId.getFilteredObjects.mockResolvedValue(mockObject);

    await act(async () => {
      render(
        <BrowserRouter>
          <ObjectDetails />
        </BrowserRouter>,
      );
    });

    expect(screen.getByTestId('mock-object-card')).toBeInTheDocument();
    expect(screen.getByTestId('object-image')).toBeInTheDocument();
    expect(screen.getByTestId('object-title')).toBeInTheDocument();
    expect(screen.getByTestId('object-details')).toBeInTheDocument();
  });

  test('displays correct object information after loading', async () => {
    getObjectId.getFilteredObjects.mockResolvedValue(mockObject);

    await act(async () => {
      render(
        <BrowserRouter>
          <ObjectDetails />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText(/LLaves de toallin/)).toBeInTheDocument();
    expect(screen.getByText(/Categoría: llaves/)).toBeInTheDocument();
    expect(screen.getByText(/Estado: Perdido/)).toBeInTheDocument();
    expect(screen.getByText(/Ubicación: Biblioteca/)).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    const errorMessage = 'API Error';
    getObjectId.getFilteredObjects.mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      render(
        <BrowserRouter>
          <ObjectDetails />
        </BrowserRouter>,
      );
    });

    expect(
      screen.getByText(`Error al cargar el objeto: ${errorMessage}`),
    ).toBeInTheDocument();
  });
});
