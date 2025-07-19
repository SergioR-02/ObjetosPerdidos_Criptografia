/* eslint-disable no-undef */
/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../templates/home/Home';
import Header from '../organisms/header/Header';

// Mock de los componentes hijos
jest.mock('../organisms/header/Header', () => {
  const Header = () => <div data-testid='mock-header'>Header</div>;
  Header.displayName = 'Header';
  return Header;
});

jest.mock('../organisms/lostObjectsSection/LostObjectsSection', () => {
  const LostObjectsSection = () => (
    <div data-testid='mock-lost-objects'>Lost Objects Section</div>
  );
  LostObjectsSection.displayName = 'LostObjectsSection';
  return LostObjectsSection;
});

jest.mock('../organisms/footer/Footer', () => {
  const Footer = () => <div data-testid='mock-footer'>Footer</div>;
  Footer.displayName = 'Footer';
  return { Footer };
});

describe('Home Component', () => {
  test('renders all main sections', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-lost-objects')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});
