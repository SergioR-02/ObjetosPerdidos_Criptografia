/* eslint-disable no-undef */
/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../templates/login/Login';

// Mock de los componentes hijos
jest.mock(
  '../organisms/loginRegistrationForget/LoginRegistrationForget',
  () => {
    const LoginRegistrationForget = () => (
      <div data-testid='mock-login-form'>
        <input data-testid='email-input' type='email' />
        <input data-testid='password-input' type='password' />
        <button data-testid='login-button'>Iniciar Sesión</button>
        <button data-testid='register-button'>Registrate</button>
      </div>
    );
    LoginRegistrationForget.displayName = 'LoginRegistrationForget';
    return LoginRegistrationForget;
  },
);

describe('Login Component', () => {
  const renderLogin = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
  };

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByTestId('mock-login-form')).toBeInTheDocument();
  });

  test('renders email and password inputs', () => {
    renderLogin();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  test('renders login and register buttons', () => {
    renderLogin();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
  });
});
