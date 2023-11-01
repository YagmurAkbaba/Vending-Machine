import {configureStore} from '@reduxjs/toolkit';
import vendingMachineReducer from '../features/vendingMachine/vendingMachineSlice';

export const store = configureStore({
    reducer: {
        vendingMachine: vendingMachineReducer
    }
  });
