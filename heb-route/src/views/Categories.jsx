import React from 'react';
import { Link } from 'react-router-dom';

import productImage from '../assets/img/products/brocoli.jpg';
import carniceriaImage from '../assets/img/categorias/carniceria.png';

import '../stylesheets/SideList.css';

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

const Categories = () => {

    const categoriesIcons = categorias.map(c=>{
        return <li key={c.id}>
            <Link to={'/categories/'+c.nombre}>
                <img src={carniceriaImage} alt={c.name} width={50} height={50} />
                <h4>{c.nombre}</h4>
            </Link>
        </li>
    });

    const categoriesProducts = products.map(p=>{
        return <div key={p.id} className='product-card'>
            <Link to={`/product/${p.id}`}>
                <img src={productImage} alt={p.nombre} width={100} height={100} />
                <div className='product-card-text'>
                    <h4>{p.nombre}</h4>
                </div>
            </Link>
        </div>
    });

    const categoriesList = categorias.map(c=>{
        return <div key={c.id}>
            <h3>{c.nombre}</h3>
            <div className='categories-products'>
                {categoriesProducts}
                <Link className='view-all-btn' to={'/categories/'+c.nombre}>View All</Link>
            </div>
        </div>
    });

    return <>
        <h1>Productos</h1>

        <h3>Categorias</h3>
        <ul className='categories'>
            {categoriesIcons}
        </ul>

        {categoriesList}
    
    
    </>

}

export default Categories;