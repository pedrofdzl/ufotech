import React from 'react';
import { Link } from 'react-router-dom';

import productImage from '../assets/img/products/brocoli.jpg';
import carniceriaImage from '../assets/img/categorias/carniceria.png';

import '../stylesheets/SideList.css'
import {Button} from '../components/ui/Button'

const products = [
    {id: 1, nombre: 'Brocoli', categoria: 'Verdura', precio: 37.9, descripcion: '500 g. El Brócoli es un alimento que ayuda a prevenir una gran cantidad de enfermedades gracias a que refuerza el sistema inmunológico. Funciona como antioxidante y es de gran ayuda para la salud cardiovascular. Contiene vitaminas A, B1, B2, B6, C y E, beta caroteno, niacina y ácido fólico, que lo convierten en uno de los vegetales más completos en lo que a nutrientes se refiere.'},
    {id: 2, nombre: 'Coca Cola 3lt', categoria: 'Refresco', precio: 40, descripcion: '3lt. Una coca cola para toda la familia'},
    {id: 3, nombre: 'Manzanas', categoria: 'Fruta', precio: 49.9, descripcion: '1 kg. Manzana roja'},
    {id: 4, nombre: 'pechuga pollo', categoria: 'Carniceria', precio: 127.60, descripcion: '500 g. Pechuga de pollo sin hueso.'},
]

const categorias = [
    {id: 1, nombre: 'Frutas'},
    {id: 2, nombre: 'Verduras'},
    {id: 3, nombre: 'Refrescos'},
    {id: 4, nombre: 'Carniceria'},
    {id: 5, nombre: 'Botana'},
    {id: 6, nombre: 'Lacteos'},
]




const Products = () =>{
    // const productItems = products.map(p=>{
    //     return <div key={p.id} className='products-col'>
    //         <Link to={'/product/'+p.id}>
    //             <img src={productImage} alt="" height={200} width={200} /> <br />
    //             <strong>${p.precio}</strong> <br /> 
    //         </Link>
    //             {p.nombre}  <br />
    //             {/* <button className='button-primary'>Add to List</button> */}
    //             <Button variant={'secondary'}>Add to List</Button>
    //     </div>
    // })

    const categoriaItems = products.map(p =>{
        return <div key={p.id} className='product-card'>
            <img src={productImage} alt={p.nombre} width={100} height={100} />
            <div className='product-card-text'>
                <h4>{p.nombre}</h4>
            </div>
        </div>
    })


    const categoriasList = categorias.map(c=>{
        return <li key={c.id}>
            <Link>
                <img src={carniceriaImage} alt="" width={50} height={50}/>
                <h4>{c.nombre}</h4>
            </Link>

        </li>
    });

    const categoriasProducts = categorias.map(c=>{
        return <div key={c.id}>
            <h3>{c.nombre}</h3>
            <div className='categories-products'>
                {categoriaItems}
                <Link className='view-all-btn'>View All</Link>
            </div>
        </div>
    })

    const searchHandler = event =>{
        event.preventDefault();
    }

    return <div>
        <h1>Productos</h1>
        
        <form onSubmit={searchHandler}>
            <label htmlFor="search">Search</label>
            <input type="text" name="search" id="search" />

        </form>

        <h3>Categorias</h3>
        <ul className='categories'>
            {categoriasList}
        </ul>

        {categoriasProducts}
    </div>

}

export default Products;