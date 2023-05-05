import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// UI
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Icons
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { BsArrowRightCircle } from 'react-icons/bs';
import { db } from '../firebase/firebase';
import { addDoc, collection } from 'firebase/firestore'


// Providers
import { ProductContext } from '../providers/ProductProvider';
import { ListContext } from '../providers/ListProvider';

const Product = () => {
  const navigate = useNavigate();
  const { categoryID, productID } = useParams();
  const { categories } = useContext(ProductContext);
  const { lists } = useContext(ListContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedList, setSelectedList] = useState('')
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (quantity < 1) setQuantity(1);
  }, [quantity]);

  const product = categories?.categories[categoryID].products.find(product => product.id === productID);

  const showAddProduct = show =>{
    setAdding(show);
  }

  const handleSelectList = event =>{
    console.log(event.target.value);
    setSelectedList(event.target.value);
  }

  const addProduct = event =>{
    event.preventDefault();

    if (selectedList !== ''){

      let listProduct = {
        list: selectedList,
        category: categoryID,
        product: productID,
        quantity: quantity
      };
      
      const listProductCollection = collection(db, 'listProduct');
      addDoc(listProductCollection, listProduct)
        .then(listProductReference=>{
          console.log('Se agrego correctamente');
          navigate(`/categories/${categoryID}`);
        })
    }
  }


  return (
    <>
      <HeaderNavitagion />
      <div className='safe-area'>

      {/* Add Product Modal */}
      {adding && <div>
        <form onSubmit={addProduct}>
          <select name="select" id="select" onChange={handleSelectList}>
            <option value="">------------</option>
            {Object.keys(lists.myLists).map(lista=>{
              return <option value={lista} key={lista}>{lists.myLists[lista].name}</option>
            })}
          </select>
          <label htmlFor="">Cantidad</label>
          <div className='product-quantity'>
                <Button variant={'add'} callbackFunction={() => setQuantity(quantity - 1)}><AiOutlineMinus/></Button>
                <div className='product-quantity-number'>
                  <Text variant={'b4'}>{quantity}</Text>
                </div>
                <Button variant={'add'} callbackFunction={() => setQuantity(quantity + 1)}><AiOutlinePlus/></Button>
              </div>
            <Button callbackFunction={()=>showAddProduct(false)}>Cancelar</Button>
            <input type="submit" value="Agregar"/>
        </form>
      </div>}


        <div className='product-detail'>
          <img className='product-detail-image' src={product['Link Imagen']} alt={product.Nombre} />
          <div className='product-detail-paper'>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className='category-tag' style={{ backgroundColor: categories?.categories[categoryID].color }}>{categories?.categories[categoryID].name}</span>
                <Text variant={'h1'}>{product.Nombre}</Text>
                <Text variant={'b4'}>{product.Capacidad} {product.Unidad}</Text>
              </div>
              <div className='product-quantity'>
                <Button variant={'add'} callbackFunction={() => setQuantity(quantity - 1)}><AiOutlineMinus/></Button>
                <div className='product-quantity-number'>
                  <Text variant={'b4'}>{quantity}</Text>
                </div>
                <Button variant={'add'} callbackFunction={() => setQuantity(quantity + 1)}><AiOutlinePlus/></Button>
              </div>
            </div>
            <br/>
            <Button variant={'add-large'} callbackFunction={()=>showAddProduct(true)}>Añadir a lista <span> ${(quantity * product.Precio)}</span></Button>
            <br/>
            <br/>
            <Text variant={'h4'}>Productos similares</Text>
            <div className='product-card-carousel' style={{ width: 'calc(100vw - 32px)' }}>
              {categories.categories[categoryID].products.slice(0, 5).map(product => {
                if (product.id !== productID) {
                  return(
                    <a className="product-card" onClick={() => navigate(`/products/${categoryID}/${product.id}`)} key={product.id}>
                      <img src={product['Link Imagen']} alt={product.Nombre} width={100} height={100} />
                      <h4>{product.Nombre}</h4>
                      <small>${product.Precio}</small>
                      <small className="product-card-unit">{product.Capacidad} {product.Unidad}</small>
                    </a>
                  );
                }
              })}
              <a className="product-category-see-more" onClick={() => navigate(`/categories/${categoryID}`)}>
                <BsArrowRightCircle className="product-category-see-more-icon" />
                <Text variant="b4">Ver más</Text>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;