import { React } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';


import broccoliImage from '../assets/img/products/brocoli.jpg'
const product = {
    id: 1,
    nombre: 'Brocoli',
    categoria: 'Verduras',
    precio: 37.9,
    descripcion: '500 g. El Brócoli es un alimento que ayuda a prevenir una gran cantidad de enfermedades gracias a que refuerza el sistema inmunológico. Funciona como antioxidante y es de gran ayuda para la salud cardiovascular. Contiene vitaminas A, B1, B2, B6, C y E, beta caroteno, niacina y ácido fólico, que lo convierten en uno de los vegetales más completos en lo que a nutrientes se refiere.'
}
    

const Product = () => {

    const { id } = useParams()
    return <>
        <small>
            <Link to={'/categories'}>Catalogo</Link>
            /
            <Link to={`/categories/${product.categoria}`}>{product.categoria}</Link>
        </small>
        <br />
        <img src={broccoliImage} alt={product.nombre} height={300} width={300} />
        <h1>{product.nombre}</h1>

        <h3>{product.precio}$</h3>
        <button>Add to List</button>
        <hr />

        <p>
            {product.descripcion}
        </p>
        <h3>Similar Products</h3>

        <>
        <Link to={`/product/${product.id}`}>
                <img src={broccoliImage} alt={product.nombre} height={100} width={100} /> <br />
                <strong>${product.precio}</strong> <br /> 
            </Link>
                {product.nombre}  <br />
                <button>Add to List</button>
        </>

    </>
}

export default Product;