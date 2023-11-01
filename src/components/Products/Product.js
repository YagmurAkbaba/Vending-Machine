import styles from './styles.module.css';
import { useDispatch } from 'react-redux';
import { setSelectedItem } from '../../redux/features/vendingMachine/vendingMachineSlice';

const Product = ({source, stockNumber, productName, productPrice}) =>{

    const dispatch = useDispatch();
    
    // console.log("styles",styles);
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
            <button className={styles.selectButton} onClick = {() => dispatch(setSelectedItem(productName={productName}))}>Select</button>

        </div>
    );

}

export default Product;