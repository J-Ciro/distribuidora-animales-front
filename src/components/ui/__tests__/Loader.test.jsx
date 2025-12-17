import { render, screen } from '@testing-library/react';
import Loader from '../Loader.jsx';

describe('Loader', () => {
  test('muestra mensaje por defecto', () => {
    render(<Loader />);
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  test('muestra mensaje personalizado', () => {
    render(<Loader message="Espere por favor" />);
    expect(screen.getByText(/Espere por favor/i)).toBeInTheDocument();
  });
});
