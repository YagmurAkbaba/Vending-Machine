import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/app/store';

test('renders vending machine title', () => {
  render(
  <Provider store={store}>
    <App />
  </Provider>
  );
  const headerElement = screen.getByText(/vending machine/i);
  expect(headerElement).toBeInTheDocument();
});
