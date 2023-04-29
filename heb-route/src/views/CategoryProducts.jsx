import React, { useEffect, useState } from 'react';
import { Link,useParams } from 'react-router-dom'

import { db } from '../firebase/firebase';
import { getDoc, getDocs, collection, query, where, doc  } from 'firebase/firestore'

import '../stylesheets/ProductCard.css';

import {Button} from '../components/ui/Button';

const CategoryProducts = () =>{
    const { categoryId } = useParams();

    const [category, setCategory] = useState({});
    const [productsJsx, setProductsJsx] = useState([]);



    useEffect(()=>{
        let getCategory = async()=>{

            // Get Category
            const categoryReference = doc(db, 'Categorias', categoryId);
            const categoryDoc = await getDoc(categoryReference);
            setCategory({id: categoryDoc.id, ...categoryDoc.data()});
        }

        getCategory();
    }, [categoryId])

    useEffect(()=>{
        let getProducts = async()=>{

            // Get Category Products
            const productCollection = collection(db, 'Productos');
            const productsQuery = query(productCollection, where('Categoria', '==', categoryId));
            const productsDocs = await getDocs(productsQuery);

            let productsList = [];
            productsDocs.forEach(product=>{
                let helper = { id: product.id, ...product.data() };
                productsList.push(helper);
            });


            let products = [];
            productsList.forEach(product =>{
                let helper = <div className='product-card' key={product.id}>
                         <img src={product['Link Imagen']} alt={product.Nombre} height={100} width={100} />
                         <div className='product-card-body'>
                             <div>
                                 <Link to={`/product/${product.id}`}>
                                     <h4>{product.Nombre}</h4>
                                     <small>{product.Precio}</small>
                                 </Link>
                                 </div>
                             <div className='margin-left-auto'>
                                 <Button className={'margin-left-auto'}>Agregar Producto</Button>
                             </div>
                         </div>
                     </div>
                products.push(helper); 
            });
            setProductsJsx(products);
        }
        getProducts();
    }, [categoryId]);

    return <>
        <h1>Categoria {category.Nombre}</h1>
        <hr />
        {productsJsx}
    </>
}

export default CategoryProducts;