/* eslint-disable no-undef */
/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../templates/register/Register';

// Mock del componente RegisterForm
jest.mock('../molecules/registerForm/RegisterForm', () => {
  const RegisterForm = () => (
    <div data-testid='mock-register-form'>
      <input data-testid='name-input' type='text' placeholder='Nombre' />
      <input data-testid='email-input' type='email' placeholder='Email' />
      <input
        data-testid='password-input'
        type='password'
        placeholder='Contraseña'
      />
      <button data-testid='register-button'>Crear cuenta</button>
    </div>
  );
  RegisterForm.displayName = 'RegisterForm';
  return RegisterForm;
});

// Mock para RegisterUser utility
jest.mock('../utilities/register', () => {
  return jest.fn().mockResolvedValue({});
});

describe('Register Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );
  });

  test('renders register form', () => {
    expect(screen.getByTestId('mock-register-form')).toBeInTheDocument();
  });

  test('renders all form inputs', () => {
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  test('renders register button', () => {
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toHaveTextContent(
      'Crear cuenta',
    );
  });
});
