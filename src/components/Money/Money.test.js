import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useSelector } from 'react-redux';
import Money from './Money';
import { store } from '../../redux/app/store';


test('renders money insert', () => {
  render(
    <Provider store={store}>
    <Money moneyAmount={20}/>
    </Provider>
  );
  const initialInsertedAmount = store.getState().vendingMachine.insertedAmount;
  const insertMoneyBtn = screen.getByText(/20/i);
  userEvent.click(insertMoneyBtn);
  const updatedInsertedAmount = store.getState().vendingMachine.insertedAmount;
  const expectedAmount = initialInsertedAmount + 20;
  expect(updatedInsertedAmount).toBe(expectedAmount);

});