import './App.css';
import Product from './components/Products/Product';
import Money from './components/Money/Money';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cancelRequest, collectMoney, getChange, getTotalChange,fill, increaseTotalEnergyConsumption, collectItem, resetVendingMachine, restart } from './redux/features/vendingMachine/vendingMachineSlice';
import { useEffect, useState } from 'react';
import { city } from './Data';

function App() {

  // global variables accross the entire project
  const {products, selectedItem, insertedAmount, change, totalChange, totalAmountInMachine, 
    isInProgress, totalEnergyConsumption, soldItem, isMachineAvailable} = useSelector((store) => store.vendingMachine);

  const dispatch = useDispatch();

    // used for security 
  const [isSafeOpen, setIsSafeOpen] = useState(false); 
  const [safeVisibility, setSafeVisibility] = useState(false);
  const [isProductsAccessible, setIsProductsAccessible] = useState(false);
  const [isProductsContainerOpen, setIsProductsContainerOpen] = useState(false);

  // used for energy consumption calculation
  const [temperature, setTemperature] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLightOpen, setIsLightOpen] = useState(false);
  const [isLightAllowed, setIsLightAllowed] = useState(true);

useEffect(() => {
  if(totalEnergyConsumption>5){ // if energy consumption exceeds 5, turn of the light 
    setIsLightOpen(false);
    setIsLightAllowed(false);
    console.log("Light is turned off to save energy!");
  }else{
    setIsLightAllowed(true);
  }
}, [totalEnergyConsumption]);

useEffect(() => {  
  var interval;
  if (isMachineAvailable) { // if machine operable
    // Initial fetch when component mounts
    fetchData();

    // Fetch data every hour
     interval = setInterval(()=>{
      fetchData()}, 3600000); // get temperature and cool or heat accordingly
     

    // Clear the interval when the component is unmounted or machine becomes unavailable
    }
    return () => {
      clearInterval(interval);
    };
}, [isMachineAvailable]);

// get temperature
const fetchData = async () => {  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=dc6e198d710d27211ed68a445d1bb01e`
    );
    const data = await response.json();
    const temperatureInCelsius = data.main.temp - 273.15; // convert to celcius
    setTemperature(temperatureInCelsius);
    console.log(temperatureInCelsius);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};


useEffect(() => {
  var interval;
  if(isMachineAvailable){
    
    interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update current time every second
  }

  return () => clearInterval(interval); // Clear the interval on component unmount
}, [isMachineAvailable]);

useEffect(() => {
  if ((currentTime.getHours() >= 17 || currentTime.getHours <=5) && isLightAllowed) {
    // Turn on the light between 17 pm - 5 am
    dispatch(increaseTotalEnergyConsumption(2/3600));
    if(!isLightOpen){
      setIsLightOpen(true);
      console.log("executes");
    }
  }else{
    setIsLightOpen(false); // turn off the light
  }
}, [currentTime, isLightOpen, isLightAllowed, dispatch]);

  useEffect(()=>{
    // get temperaute change and     
      if(!temperature===20){ // it can be an interval too (20 is an assumption)
        // if temperature is not 20, energy consumption is increased by 2  for an hour
        setInterval(() => dispatch(increaseTotalEnergyConsumption(2)), 1000);
        console.log(totalEnergyConsumption);
      }
  }, [temperature, totalEnergyConsumption, dispatch]);

  useEffect(()=>{
    // user and machine interaction can last 5 min at most
    if(isInProgress){
      setTimeout(()=> dispatch(cancelRequest()), 300000);
    }
  }, [isInProgress,dispatch]);

  // vending machine
  return (
    <div className="vending-machine-container">
      <header className="vending-machine-header">
        {/* if 17pm - 5 am displays yellow lightbulb else black */}
        {isLightOpen ? <img className='lightbulb' src='/images/on.png' alt='Ligth is on'/>:<img className='lightbulb' src='/images/off.png' alt='Ligth is off'/> }
        VENDING MACHINE</header>
      <div className="products">

        {products.map((item, i) =>
            <Product
            key={new Date().getTime + Math.random()}
            productName={item.name}
            productPrice={item.price}
            stockNumber={item.amount}
            source={item.image}
            />
        )}

        {/* secure products */}
        <button className='openButton' onClick={()=>{
          if(!isProductsContainerOpen){
            // ask password
            let password = Number(window.prompt("Enter password!", ""));
            if(password===1111){
              setIsProductsContainerOpen(!isProductsContainerOpen);
              setIsProductsAccessible(true);              
            }else{
              alert("Wrong password!");
            }
          }else{
            // clicked when already open
            setIsProductsContainerOpen(!isProductsContainerOpen);
            setIsProductsAccessible(false);
          }
          
        }}>O</button>
        
        {/* if products accessible supplier can fill  */}
        {isProductsAccessible ? <button className='fillProducts' onClick={() => dispatch(fill())}>Fill Products</button>
                              : 
                                <div className='item-container'>
                                  <div>Your Product: {soldItem}</div>
                                  <button className='buttons totalChangeButton' onClick={()=>dispatch(collectItem())}>Collect Item</button>
                                </div>
                                
                              }
      </div>
      <div className="operations"> 
       
       {/* UI shows user inserted amount cost and change information        */}
        <div className='screen'>
          <div>{`Total Inserted Amount: ${insertedAmount}`}</div>  
          <div>Selected Item: {selectedItem.name}</div>
          <div>Cost: {selectedItem.price} TL</div> 
        </div>
        <div className='moneyOperations'> 
          <div className='insert-money'>INSERT MONEY</div> 
          {/* existing moneys not all accepted  */}
          <div className = "moneys">            
            <Money moneyAmount = {0.25}/>
            <Money moneyAmount = {0.5}/>
            <Money moneyAmount = {1}/>
            <Money moneyAmount = {5}/>
            <Money moneyAmount = {10}/>
            <Money moneyAmount = {20}/>
            <Money moneyAmount = {50}/>
            <Money moneyAmount = {100}/>
            <Money moneyAmount = {200}/>
          </div>

          {/* cancels the request */}
          <button className='buttons cancelButton' onClick={() => dispatch(cancelRequest())}>Cancel</button>
        </div>

        {/* user can take their change */}
        <div className='change-box'>
          <div>Change: {change} TL</div>
          <button className='buttons changeButton' onClick={() => dispatch(getChange())}>Get Change</button>
          <div>Total Change: {totalChange} TL</div>
          <button className='buttons totalChangeButton' onClick={() => dispatch(getTotalChange())}>Get Total Change</button> 
        </div>
      </div>

      {/* safe where money is collected, supplier can reach to safe by entering password 
      supplier can reset, restart the machine and collect the money */}
      <div className="safe">
        <button className='openButton' onClick={()=>{
          if(!isSafeOpen){
            let password = Number(window.prompt("Enter password!", ""));
            if(password===1212){
              setIsSafeOpen(!isSafeOpen);
              setSafeVisibility(true);              
          }else{
            alert("Wrong password!");
          }
          }else{
            setIsSafeOpen(!isSafeOpen);
            setSafeVisibility(false);
          }
          
        }}>O</button>
        {safeVisibility && <div className='secure-money'>
          <div>Total: {totalAmountInMachine}</div>
          <button className='buttons changeButton' onClick={() => dispatch(collectMoney())}>Collect Money</button>
          <button className='buttons changeButton' onClick={() => dispatch(resetVendingMachine())}>Reset</button>
          <button className='buttons changeButton' onClick={() => dispatch(restart())}>Restart</button>
        </div>}
      </div>

    </div>
  );
}

export default App;
