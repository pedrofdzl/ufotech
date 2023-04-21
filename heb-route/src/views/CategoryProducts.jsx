import React from 'react';
import { Link,useParams } from 'react-router-dom'

import broccoliImage from '../assets/img/products/brocoli.jpg';

import '../stylesheets/ProductCard.css';

import {Button} from '../components/ui/Button';

const products = [
    {id: 1, nombre: 'Brocoli', categoria: 'Verdura', precio: 37.9, descripcion: '500 g. El Brócoli es un alimento que ayuda a prevenir una gran cantidad de enfermedades gracias a que refuerza el sistema inmunológico. Funciona como antioxidante y es de gran ayuda para la salud cardiovascular. Contiene vitaminas A, B1, B2, B6, C y E, beta caroteno, niacina y ácido fólico, que lo convierten en uno de los vegetales más completos en lo que a nutrientes se refiere.'},
    {id: 2, nombre: 'Coca Cola 3lt', categoria: 'Refresco', precio: 40, descripcion: '3lt. Una coca cola para toda la familia'},
    {id: 3, nombre: 'Manzanas', categoria: 'Fruta', precio: 49.9, descripcion: '1 kg. Manzana roja'},
    {id: 4, nombre: 'pechuga pollo', categoria: 'Carniceria', precio: 127.60, descripcion: '500 g. Pechuga de pollo sin hueso.'},
]

const CategoryProducts = () =>{
    const { category } = useParams();

    const categoryProducts = products.map(p=>{
        return <div className='product-card'>
            <img src={broccoliImage} alt="" height={100} width={100} />
            <div className='product-card-body'>
                <div>
                    <Link to={`/product/${p.id}`}>
                        <h4>{p.nombre}</h4>
                        <small>{p.precio}</small>
                    </Link>
                    </div>
                <div className='margin-left-auto'>
                    <Button className={'margin-left-auto'}>Agregar Producto</Button>
                </div>
            </div>
        </div>
    })


    return <>
        <h1>Categoria {category}</h1>
        <hr />
        {categoryProducts}
    </>
}

export default CategoryProducts;