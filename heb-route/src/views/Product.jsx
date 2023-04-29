import React, { useEffect, useState }  from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { db } from '../firebase/firebase';
import { getDoc, doc, collection, getDocs, query, where, limit } from 'firebase/firestore';


const Product = () => {

    const { productId } = useParams();

    const [product, setProduct] = useState({});
    const [category, setCategory] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(()=>{
        const getData = async()=>{

            // Get Product
            const productReference = doc(db, 'Productos', productId)
            const productDoc = await getDoc(productReference);
            const helperProduct = { id: productDoc.id, ...productDoc.data() }


            const categoryReference = doc(db, 'Categorias', helperProduct.Categoria);
            const categoryDoc = await getDoc(categoryReference);
            const helperCategory = { id: categoryDoc.id, ...categoryDoc.data() }
            
            setCategory(helperCategory);
            setProduct(helperProduct);

            // Get Similar Products
            const productsCollection = collection(db, 'Productos')
            const productsQuery = query(productsCollection, where('Categoria', '==', helperProduct.Categoria), limit(5));
            const productsDocs = await getDocs(productsQuery);

            let similarProductsJSX = [];
            productsDocs.forEach(product=>{
                const productHelper = { id: product.id, ...product.data() }
                
                let helper =  <div key={productHelper.id}>
                <Link to={`/product/${productHelper.id}`}>
                        <img src={productHelper['Link Imagen']} alt={productHelper.Nombre} height={100} width={100} /> <br />
                        <strong>${productHelper.Precio}</strong> <br /> 
                    </Link>
                        {productHelper.Nombre}  <br />
                        <button>Add to List</button>
                </div>
                similarProductsJSX.push(helper);
            });

            setSimilarProducts(similarProductsJSX);
        }

        getData();
    }, [productId]);

    return <>
        <small>
            <Link to={'/categories'}>Catalogo</Link>
            /
            <Link to={`/categories/${category.id}`}>{category.Nombre}</Link>
        </small>
        <br />
        <img src={product['Link Imagen']} alt={product.Nombre} height={300} width={300} />
        <h1>{product.Nombre}</h1>

        <h3>{product.Precio}$</h3>
        <button>Add to List</button>
        <hr />

        <p>
            {product.descripcion}
        </p>
        <h3>Similar Products</h3>


        {similarProducts}
        

    </>
}

export default Product;