import React, { useContext } from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

// Providers
import { ModalContext } from '../../providers/ModalProvider';

// Components
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';

// Utils
import { truncate, currency } from '../../utils/utils';

// Stylesheets
import '../../stylesheets/Dashboard.css';
import '../../stylesheets/Products.css';

// Icons
import { AiOutlinePlus } from 'react-icons/ai';

const ProductCard = ({ product, category }) => {
  const { productModalPayload, setProductModalOpen, setProductModalPayload } =
    useContext(ModalContext);
  const location = useLocation();

  const openProductModal = ({ product, category }) => {
    setProductModalPayload({
      ...productModalPayload,
      currentProduct: product,
      currentCategory: category,
    });
    setProductModalOpen(true);
  };

  return (
    <div key={product.id} className='product-detailed-card'>
      <Link
        to={`/products/${category}/${product.id}`}
        state={{
          prev: location.pathname,
          search: location.search,
        }}>
        <img src={product['Link Imagen']} alt={product.Nombre} />
      </Link>
      <div style={{ display: 'block', width: '100%' }}>
        <Text variant={'h5'}>{truncate(product.Nombre, 20)}</Text>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            <small className='product-detailed-card-unit'>
              {product.Capacidad} {product.Unidad} /
            </small>
            <small>{currency(product.Precio)}</small>
          </div>
          <Button variant={'add'}>
            <AiOutlinePlus
              onClick={() =>
                openProductModal({ product: product.id, category: category })
              }
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
