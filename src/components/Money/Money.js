import styles from './styles.module.css';
// import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { insertMoney } from '../../redux/features/vendingMachine/vendingMachineSlice';

const Money = ({moneyAmount}) => { // This is a money component that takes amount as paramter 
                                    //and creates a button that adds amount of money to total inserted amount
    
    const dispatch = useDispatch(); 

    return(
        <button className = {styles.moneyButton} onClick = {() => dispatch(insertMoney(moneyAmount))}>
            {moneyAmount}
        </button>
    );
}

export default Money;