import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, createSearchParams, Link, useLocation } from 'react-router-dom';

// UI
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Components
import ProductCard from '../components/products/ProductCard';

// Icons
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { BsArrowRightCircle } from 'react-icons/bs';

// Providers
import { ModalContext } from '../providers/ModalProvider';
import { ProductContext } from '../providers/ProductProvider';

// Utils
import { currency } from '../utils/utils';

// Error View
import { http404 } from '../errorhandling/errors';

const Product = () => {
  const navigate = useNavigate();
  const { categoryID, productID } = useParams();
  const { categories } = useContext(ProductContext);
  const { productModalPayload, setProductModalOpen, setProductModalPayload } =
    useContext(ModalContext);

  const [quantity, setQuantity] = useState(1);
  const location = useLocation();

  useEffect(() => {
    if (quantity < 1) setQuantity(1);
  }, [quantity]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const succesHandler = () => {
    navigate({
      pathname: '/',
      search: `?${createSearchParams({tab:'Dashboard'})}`
    })
  }

  // Check if category and product exists
  if (!(categoryID in categories.categories)){
    throw new http404('Categoría no encontrada');
  }

  const product = categories?.categories[categoryID].products.find(
    (product) => product.id === productID
  );

  if (!product){
    throw new http404('Producto no encontrado');
  }

  const openProductModal = () => {
    setProductModalPayload({
      ...productModalPayload,
      currentCategory: categoryID,
      currentProduct: productID,
      currentQuantity: 1,
      success: succesHandler
    });
    setProductModalOpen(true);
  };

  return (
    <>
      <HeaderNavitagion />
      <div className='safe-area'>
        <div className='product-detail'>
          <img
            className='product-detail-image'
            src={product['Link Imagen']}
            alt={product.Nombre}
          />
          <div className='product-detail-paper'>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  className='category-tag'
                  style={{
                    backgroundColor: categories?.categories[categoryID].color,
                  }}>
                  {categories?.categories[categoryID].name}
                </span>
                <Text variant={'h1'}>{product.Nombre}</Text>
                <Text variant={'b4'}>
                  {product.Capacidad} {product.Unidad}
                </Text>
              </div>
              <div className='product-quantity'>
                <Button
                  variant={'add'}
                  callbackFunction={() => setQuantity(quantity - 1)}>
                  <AiOutlineMinus />
                </Button>
                <div className='product-quantity-number'>
                  <Text variant={'b4'}>{quantity}</Text>
                </div>
                <Button
                  variant={'add'}
                  callbackFunction={() => setQuantity(quantity + 1)}>
                  <AiOutlinePlus />
                </Button>
              </div>
            </div>
            <br />
            <Button
              variant={'add-large'}
              callbackFunction={() => openProductModal()}>
              Añadir a lista{' '}
              <span style={{ marginLeft: 4 }}>{`${currency(
                quantity * product.Precio
              )}`}</span>
            </Button>
            <br />
            <br />
            <Text variant={'h4'}>Productos similares</Text>
            <div
              className='product-card-carousel'
              style={{ width: 'calc(100vw - 32px)' }}>
              {categories.categories[categoryID].products
                .slice(0, 5)
                .map((product) => {
                  if (product.id !== productID) {
                    return (
                      <ProductCard key={product.id} product={product} category={categoryID} />
                    );
                  }
                })}
              <a
                className='product-category-see-more'
                onClick={() => navigate(`/categories/${categoryID}`)}>
                <BsArrowRightCircle className='product-category-see-more-icon' />
                <Text variant='b4'>Ver más</Text>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
