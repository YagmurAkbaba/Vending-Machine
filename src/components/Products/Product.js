import styles from './styles.module.css';
import { useDispatch } from 'react-redux';
import { setSelectedItem } from '../../redux/features/vendingMachine/vendingMachineSlice';

const Product = ({source, stockNumber, productName, productPrice}) =>{

    // This is a product component takes source of image, stockNumber, productName, productPrice
    // shows image, productName, price and stock status in UI 

    const dispatch = useDispatch();
    
    return(
        <div className = {styles.container}>
            <div className = {styles.imageContainer}>
                <img className = {styles.image} src={source} alt={`This is a ${productName}`}/>
            </div>
            <div className = {styles.productName}>
                {productName}
            </div>
            <div className = {styles.stockNumber}>
                {`Stock: ${stockNumber}`}
            </div>
            <div className = {styles.productPrice}>
                {productPrice} TL
            </div>
            
             {/* if select button is clicked then sets the selected item as that product */}
            <button className={styles.selectButton} onClick = {() => dispatch(setSelectedItem(productName={productName}))}>Select</button>

        </div>
    );

}

export default Product;