import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import HeaderNavitagion from "../navigators/HeaderNavigation";

import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { ListContext } from "../providers/ListProvider";
import { ProductContext } from "../providers/ProductProvider";

import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { BsArrowRightCircle } from 'react-icons/bs';

import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';

const ListaCompra = () =>{
    const { listID } = useParams();
    const { lists } = useContext(ListContext);
    const { categories } = useContext(ProductContext);

    // const [list, setList] = useState({});
    const [products, setProducts] = useState({})
    const list = lists.myLists[listID]


    useEffect(()=>{
        const listProductCollection = collection(db, 'listProduct');
        const listProductsQuery = query(listProductCollection, where('list', '==', listID));
        let auxProducts = products;
        getDocs(listProductsQuery).then(productsSnapshot=>{
            productsSnapshot.forEach(prod=>{
                let data = prod.data();
                let auxProd = categories?.categories[data.category].products.find(product => product.id === data.product);
                auxProducts[data.product] = {...auxProd, cantidad: data.quantity, relacion: prod.id}
                setProducts({...auxProducts})
            });
        })
            
    }, [])

    return <>
        <HeaderNavitagion params={{'tab': 'Lists'}} />
        <h1>{list.name}</h1>
        <small>Owner: {list.owner}</small>
        <small>Creado: {list.createdDate.getDate()}-{list.createdDate.getMonth()+1}-{list.createdDate.getFullYear()}</small>
        <hr />
        { Object.keys(products).map(product=>{
            // console.log(product)
            return <div key={product}>
                <h4>{products[product].Nombre} - {products[product].cantidad}</h4>
                <small>Precio: {products[product].Precio}</small>
                <small>Total: {products[product].Precio * products[product].cantidad }</small>

                <div className='product-quantity'>
                <Button variant={'add'} callbackFunction={() => ''}><AiOutlineMinus/></Button>
                <div className='product-quantity-number'>
                  <Text variant={'b4'}>{}</Text>
                </div>
                <Button variant={'add'} callbackFunction={() => ''}><AiOutlinePlus/></Button>
              </div>
           </div> 
        }) }
    </>
};


export default ListaCompra;