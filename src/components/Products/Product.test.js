import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useSelector } from 'react-redux';
import Product from './Product';
import { store } from '../../redux/app/store';

describe('Product Item Selection Tests', () => {
    let product, selectedItem;
    beforeEach(()=>{
        product = store.getState().vendingMachine.products[0];
        render(
          <Provider store={store}>
          <Product productName={product.name} productPrice={product.price} source={product.image} stockNumber={product.amount}/>
          </Provider>
        );
        const selectBtn = screen.getByText(/Select/i);
        userEvent.click(selectBtn);
        selectedItem= store.getState().vendingMachine.selectedItem;
    })

    test('renders item selected', () => {       
      expect(selectedItem).not.toBeNull();
    
    });
    
    test('renders selected item is correct', () => {      
      expect(selectedItem).toBe(product);    
    });
})


