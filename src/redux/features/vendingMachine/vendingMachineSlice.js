import { createSlice } from "@reduxjs/toolkit";
import { storeData } from "../../../Data";

// initial states
const initialState = {
    products: storeData, // products list
    totalAmountInMachine: 350, // initial money amount to give change (it is an assumption)
    insertedAmount: 0, // money inserted by user
    selectedItem :{}, // item selected by user
    isItemSelected: false, // if there is any item selected
    change:0, // change
    totalChange:0, // if user does not take the change it is saved in total change
    purchaseInProgress: false, // for now it is not an async operation but for later purpose, during purchase transaction
    isInProgress: false, // if there is any interaction with the machine - money insertion or item selection
    totalEnergyConsumption:0, // total energy consumption of the machine
    soldItem: "", // sold item to return user
    isMachineAvailable:true // is machine reset by owner and not working or operable
}


export const vendingMachineSlice = createSlice({
    name:"vendingMachine",
    initialState,
    reducers: {
       
        // Allows vending machine supplier to collect money 
        // But 350 is not given in this operation to be able give change (it is an assumption)
        collectMoney : (state) =>{
            state.totalAmountInMachine=350;
        },

        // Allows user to insert money to machine
        insertMoney : (state, action) => {
            // if money unit is not 1, 5, 10, 20 or if there is a continuing transaction 
            // or if machine is reset by the owner money will not be accepted
            if((!(action.payload === 1 || action.payload === 5 || action.payload === 10 || action.payload === 20)) || state.purchaseInProgress || !state.isMachineAvailable){
                alert("İşlem Yapılamıyor");
                return;
            }
            state.isInProgress=true; // user interaction detected
            state.insertedAmount += action.payload; // adds money
            
            if (state.insertedAmount >= state.selectedItem.price) {
                // if inserted amount is enough sells the item
                    
                    // sell item add money to safe, return product and change
                    // set initial values to required states
                    state.purchaseInProgress=true;
                    state.totalAmountInMachine+=state.selectedItem.price;
                    state.change = state.insertedAmount - state.selectedItem.price;
                    state.totalChange += state.insertedAmount - state.selectedItem.price;
                    state.products.find(item => item.name === state.selectedItem.name).amount--;
                    state.soldItem=state.selectedItem.name;
                    state.selectedItem={};
                    state.insertedAmount=0;
                    state.isItemSelected=false;
                    state.purchaseInProgress=false;

                     // 1 hour is 3600 seconds - it is assumed that this single operation lasts 1 sec
                    state.totalEnergyConsumption+=(2/3600);
        }
            
        
        },
        setSelectedItem : (state, action) => {
            
            if(state.purchaseInProgress || !state.isMachineAvailable){
               // if there is a continuing transaction 
            // or if machine is reset by the owner item will not be selectable
                alert("İşlem Yapılamıyor");
                return;
            }
            
            state.isInProgress=true; // user interaction detected

            // find which item is selected
            const item = state.products.find(item => item.name === action.payload.productName);

            if(item.amount===0){
                // if there is no item left warn user and cancel operation
                alert("This product is not available!");
                state.change = state.insertedAmount;
                state.totalChange += state.insertedAmount;
                state.insertedAmount = 0;
                state.selectedItem={};
                state.isItemSelected=false;
                state.isInProgress=false;
                return;
            }
            
            // state.isItemSelected ? state.insertedAmount < state.selectedItem.price ? 
            //                         state.selectedItem = item : null 
            //                     : state.selectedItem = item;
           
            // if any item selected
            if (state.isItemSelected) {
                console.log("item selected");
                if(state.insertedAmount < state.selectedItem.price) { 
                    //if inserted amoun is less than price, selected item can be changed
                  state.selectedItem = item;
                  state.isItemSelected = true;

                 }
                 // if purchase is applicable, sell
                 if(state.insertedAmount> state.selectedItem.price){
                    console.log("1111");
                    
                        state.purchaseInProgress=true;
                        state.totalAmountInMachine+=item.price;
                        state.change = state.insertedAmount - item.price;
                        state.totalChange += state.insertedAmount - item.price;
                        // item.amount--;
                        state.soldItem=item.name;
                        state.selectedItem={};
                        state.insertedAmount=0;
                        state.isItemSelected=false;
                        state.purchaseInProgress=false;
                        state.totalEnergyConsumption+=(2/3600); 
                    
                                        
                }
              } else { // initially there is no selected item
               
                // set selected item
                state.selectedItem = item;
                state.isItemSelected = true; // warn machine there is an item selected

                // if purchase applicable, sell
                if(state.insertedAmount >= state.selectedItem.price){
                    
                    state.purchaseInProgress=true;
                    state.totalAmountInMachine+=item.price;
                    state.change = state.insertedAmount - item.price;
                    state.totalChange += state.insertedAmount - item.price;
                    item.amount--;
                    state.soldItem=item.name;
                    state.selectedItem={};
                    state.insertedAmount=0;
                    state.isItemSelected=false;
                    state.purchaseInProgress=false;
                    state.totalEnergyConsumption+=(2/3600);
                    
                                     
                }
              }
            
           
        },

        // user can cancel the request if sale is not started and gets money back
        cancelRequest : (state) =>{
            if(state.purchaseInProgress){ 
                alert("Invalid Request");
                return;}
            state.change = state.insertedAmount;
            state.totalChange += state.insertedAmount;
            state.insertedAmount = 0;
            state.selectedItem={};
            state.isItemSelected=false;
            state.isInProgress=false;
        },

        // user collects the change
        getChange : (state) =>{
            state.totalChange-=state.change;
            state.change = 0;
        },

        // if there is any user that did not take change, all change is saved in total change
        getTotalChange : (state) =>{
            state.totalChange=0;
            state.change = 0;
        },

        // vending machine supplier can fill the products
        fill: (state)=>{
            if(state.isMachineAvailable){
                state.products.forEach(item => {item.amount=10});
            }else{
                alert("You need to restart the machine!");
            }
            
        },

        // increases total energy consumption of machine 
        increaseTotalEnergyConsumption: (state, action) =>{
            // if(state.isMachineAvailable){
                state.totalEnergyConsumption+=action.payload;
            // }
            
        },

        // user get their product
        collectItem:(state) =>{
            state.soldItem="";
        },

        // vending machine supplier can reset machine , in this case machine will not operate till restart
        resetVendingMachine: (state) =>{
            state.isMachineAvailable=false;
            state.products=[];
            state.totalAmountInMachine=0;
            state.insertedAmount= 0;
            state.selectedItem ={};
            state.isItemSelected= false;
            state.change=0;
            state.totalChange=0;
            state.purchaseInProgress= false;
            state.isInProgress= false;
            state.totalEnergyConsumption=0;
            state.soldItem= "";
        },
        // vending machine supplier can  restart machine if reset
        restart: (state) =>{
            if(!state.isMachineAvailable){
                state.isMachineAvailable=true;
                state.products=storeData;
                state.totalAmountInMachine=350;
            }
            
           
        }
    }
});

export const {collectMoney, insertMoney, setSelectedItem, cancelRequest, getChange, getTotalChange, fill,
     increaseTotalEnergyConsumption, collectItem, resetVendingMachine, restart} = vendingMachineSlice.actions
export default vendingMachineSlice.reducer