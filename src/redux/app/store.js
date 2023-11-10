import {configureStore} from '@reduxjs/toolkit';
import vendingMachineReducer from '../features/vendingMachine/vendingMachineSlice';

// Storage 
export const store = configureStore({
    reducer: {
        vendingMachine: vendingMachineReducer
    }
  });
