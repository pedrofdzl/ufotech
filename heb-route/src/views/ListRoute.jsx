import React, { useContext, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Providers
import { ListContext } from '../providers/ListProvider';
import { ProductContext } from '../providers/ProductProvider';

// Components
import { RouteItem } from '../components/simulation/RouteItem';
import { Text } from '../components/ui/Text';
import Canvas from '../components/simulation/Canvas'


// Stylesheets
import '../stylesheets/Route.css';

// Styles
import styled from '@emotion/styled';

const CanvasBox = styled.div`
    box-sizing: border-box;
    margin: 0 auto;
    display: block;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
`;

const ListRoute = () => {

  const { listID } = useParams();

  const { lists } = useContext(ListContext);
  const { categories } = useContext(ProductContext);

  const [list] = useState(lists.myLists[listID]);
  const [nodeQueue, setNodeQueue] = useState([]);
  const [nodeProducts, setNodeProducts] = useState({});
  const [widthCanvas, setWidthCanvas] = useState(0);
  const [heightCanvas, setHeightCanvas] = useState(0);

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
    console.log(auxNodeQueue)
    setNodeProducts(auxNodeProducts);
    setNodeQueue(auxNodeQueue);
  }, []);

  useEffect(() => {
    if (nodeQueue.length > 1) {
      console.log(nodeProducts)
      const node = nodeQueue[nodeQueue.length - 1];
      var allPicked = true;
      nodeProducts[node].forEach((nodeProduct, index) => {
        if (nodeProducts[node][index].picked === false) allPicked = false;
      });
      if (allPicked) {
        const auxNodeQueue = JSON.parse(JSON.stringify(nodeQueue));
        const poppedQueue = auxNodeQueue.slice(0, -1);
        setNodeQueue(poppedQueue);
        console.log(poppedQueue)
      }
    }
  }, [nodeProducts]);

  const pickUpProduct = (node, productID) => {
    nodeProducts[node].forEach((nodeProduct, index) => {
      let auxNode = nodeProducts[node];
      if (nodeProduct.productID === productID) {
        auxNode[index].picked = true;
        setNodeProducts({...nodeProducts, node: auxNode });
      }
    });
  };

  return (
    <>
      <HeaderNavitagion />
      <div className='route-simulation-container' ref={canvasSizeRef}>
        <CanvasBox> {nodeQueue && nodeQueue.length > 0 && widthCanvas && <Canvas nodeQueue={nodeQueue} handleChange={handleChange} width={widthCanvas} height={heightCanvas} />}</CanvasBox>
      </div>
      <div className='route-paper-container'>
        {nodeQueue.slice().reverse().map((node, index) => {
          return (
            <div key={index}>
              {index === 0 && <Text variant='h3'>Recoge ahora</Text>}
              {index === 1 && <Text variant='h3'>Siguientes productos</Text>}
              <div key={node}>
                {nodeProducts[node].map((product) => {
                  return (<RouteItem
                    product={product}
                    node={node}
                    quantity={list.products[product.product.id].quantity}
                    callbackFunction={pickUpProduct} />);
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ListRoute;
