import React, { useContext, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Providers
import { ListContext } from '../providers/ListProvider';
import { ProductContext } from '../providers/ProductProvider';

// Components
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import Canvas from '../components/simulation/Canvas'

// Utils
import { truncate } from '../utils/utils';

// Stylesheets
import '../stylesheets/Route.css';

// Styles
import styled from '@emotion/styled';

const CanvasBox = styled.div`
    box-sizing: border-box;
    border: 1px solid #000000;
    margin: 0 auto;
    display: block;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
`;

const ListRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { listID } = useParams();

  const { lists } = useContext(ListContext);
  const { categories } = useContext(ProductContext);

  const [list] = useState(lists.myLists[listID]);
  const [nodeQueue, setNodeQueue] = useState([]);
  const [nodeProducts, setNodeProducts] = useState({});
  const [widthCanvas, setWidthCanvas] = useState(0);
  const [heightCanvas, setHeightCanvas] = useState(0);

  const handlePop = () => {
    const auxNodeQueue = [...nodeQueue];
    auxNodeQueue.pop();
    setNodeQueue(auxNodeQueue);
  };

  const handleChange = (newValue) => {
    setNodeQueue(newValue);
  };

  const canvasSizeRef = useRef(null);
  let timeOut;
  useLayoutEffect(() => {
    setWidthCanvas(canvasSizeRef.current.offsetWidth);
    setHeightCanvas(canvasSizeRef.current.offsetHeight);

    const handleResize = () => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        setWidthCanvas(canvasSizeRef.current.offsetWidth);
        setHeightCanvas(canvasSizeRef.current.offsetHeight);
      }, 100);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);

    let auxNodeQueue = [];
    let auxNodeProducts = {};
    Object.keys(list.products).forEach((productID) => {
      const productObject = categories?.categories[
        list.products[productID].category
      ].products.find(
        (product) => product.id === list.products[productID].product
      );

      let auxProduct = {
        picked: false,
        product: productObject,
        quantity: list.products[productID].quantity,
        productID: list.products[productID].product,
        categoryID: list.products[productID].category,
      };
      if (!auxNodeQueue.find((node) => node === productObject.node)) {
        auxNodeQueue.push(productObject.node);
        auxNodeProducts[productObject.node] = [];
      }
      auxNodeProducts[productObject.node].push(auxProduct);
    });

    setNodeProducts(auxNodeProducts);
    setNodeQueue(auxNodeQueue);
  }, []);

  const pickUpProduct = (node, productID) => {
    handlePop();
  };

  return (
    <>
      <HeaderNavitagion />
      <div className='route-simulation-container' ref={canvasSizeRef}>
      <CanvasBox> { nodeQueue && nodeQueue.length > 0 && widthCanvas && <Canvas nodeQueue={nodeQueue} handleChange={handleChange} width={widthCanvas} height={heightCanvas}/> }</CanvasBox>
      </div>
      <div className='route-paper-container'>
        {nodeQueue.map((node, index) => {
          return (
            <>
              {index === 0 && <Text variant='h3'>Recoge ahora</Text>}
              {index === 1 && <Text variant='h3'>Siguientes productos</Text>}
              <div key={node}>
                {nodeProducts[node].map((product) => {
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
                        />
                        <div>
                          <Text
                            variant={'b1'}
                            styles={{
                              marginTop: 0,
                              marginBottom: 2,
                              fontSize: 16,
                            }}>
                            {list.products[product.product.id].quantity *
                              product.product.Precio}
                          </Text>
                          <Text
                            variant={'b1'}
                            styles={{
                              marginTop: 0,
                              marginBottom: 4,
                              fontWeight: 400,
                              fontSize: 15,
                            }}>
                            {truncate(product.product.Nombre, 2)}
                            {` (${product.quantity})`}
                          </Text>
                          <Text variant={'b3'} styles={{ margin: 0 }}>
                            {product.product.Capacidad} {product.product.Unidad}
                          </Text>
                        </div>
                      </div>
                      <Button callbackFunction={() => pickUpProduct(node, product.product.id)} styles={{ width: 100 }}>Recoger</Button>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ListRoute;
