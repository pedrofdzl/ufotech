import React from 'react';

// Components
import { Text } from '../../components/ui/Text';

// Utils
import { truncate } from '../../utils/utils';

// Stylesheets
import '../../stylesheets/Route.css';

export const RouteItem = ({ node, product, quantity, current, callbackFunction }) => {
  return (
    <div key={product.productID} className='route-product'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <img
          src={product.product['Link Imagen']}
          alt={product.product.Nombre}
          style={{ opacity: product.picked ? 0.3 : 1, marginRight: 8 }}
        />
        <div>
          <Text
            variant={'b1'}
            styles={{
              marginTop: 0,
              marginBottom: 4,
              fontWeight: 400,
              fontSize: 14,
            }}>
            {quantity} pzas
          </Text>
          <Text
            variant={'b1'}
            styles={{
              marginTop: 0,
              marginBottom: 4,
              fontWeight: 500,
              fontSize: 16,
            }}>
            {truncate(product.product.Nombre, 24)}
          </Text>
          <Text variant={'b3'} styles={{ margin: 0 }}>
            {product.product.Capacidad} {product.product.Unidad}
          </Text>
        </div>
      </div>
      {current &&
      <div onClick={() => {
        callbackFunction(node, product.product.id);
      }} className='checkbox'>
        {product.picked && <div className='check'></div>}
      </div>}
    </div>
  );
};

export default RouteItem;
