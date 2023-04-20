import React from 'react';
import { useParams } from 'react-router-dom'


const CategoryProducts = () =>{
    const { category } = useParams();

    return <>
        <h1>Categoria {category}</h1>
    </>
}

export default CategoryProducts;