import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Navigators
import HeaderNavitagion from '../navigators/HeaderNavigation';

// UI
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';

// Providers
import { ProductContext } from '../providers/ProductProvider';

// Icons
import { AiOutlinePlus } from 'react-icons/ai';

// Utils
import { truncate } from '../utils/utils';

const Category = () => {
  const navigate = useNavigate();
  const { categoryID } = useParams();
  const { categories } = useContext(ProductContext);

  const category = categories.categories[categoryID];

  return (
    <>
      <HeaderNavitagion params={{'tab': 'Dashboard'}}/>
      <div className='safe-area'>
        <Text variant={'h1'}>
          {category.name} {category.emoji}
        </Text>
        <br />
        <div className='category-product-grid'>
          {category.products.map((product) => {
            return (
              <div className='product-detailed-card'>
                <a onClick={() => navigate(`/products/${categoryID}/${product.id}`)}>
                  <img src={product['Link Imagen']} alt={product.Nombre} />
                </a>
                <div style={{ display: 'block', width: '100%' }}>
                  <Text variant={'h5'}>{truncate(product.Nombre, 20)}</Text>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <small className='product-detailed-card-unit'>
                        {product.Capacidad} {product.Unidad} /
                      </small>
                      <small>${product.Precio}</small>
                    </div>
                    <Button variant={'add'}>
                      <AiOutlinePlus />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Category;
