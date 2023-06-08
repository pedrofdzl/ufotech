import React, { useContext, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation, Route } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Providers
import { ListContext } from '../providers/ListProvider';
import { ProductContext } from '../providers/ProductProvider';
import { ModalContext } from '../providers/ModalProvider';

// Components
import { RouteItem } from '../components/simulation/RouteItem';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import Canvas from '../components/simulation/Canvas.tsx'

// Stylesheets
import '../stylesheets/Route.css';

// Styles
import styled from '@emotion/styled';


const ListRoute = () => {
  const { listID } = useParams();

  const { lists } = useContext(ListContext);
  const { categories } = useContext(ProductContext);

  const [list] = useState(lists.myLists[listID]);
  const [nodeQueue, setNodeQueue] = useState([]);
  const [nodeProducts, setNodeProducts] = useState({});
  const [widthCanvas, setWidthCanvas] = useState(0);
  const [heightCanvas, setHeightCanvas] = useState(0);
  const [centerButton, setCenterButton] = useState(false);
  const [started, setStarted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { setRouteCompleteModalOpen, setRouteCompleteModalPayload } = useContext(ModalContext);

  const handleChange = (newValue) => {
    setNodeQueue(newValue);
  };

  const goBack = () => {
    navigate({
      // pathname: '/dashboard'
      // pathname:location.state.prev,
      pathname: (location.state?.prev) ? location.state.prev : '/',
      // search:`?${createSearchParams(params)}`
      search: (location.state?.search) ? location.state.search : ''
    })
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

  useEffect(() => {
    if (nodeQueue.length > 1) {
      const node = nodeQueue[nodeQueue.length - 1];
      var allPicked = true;
      nodeProducts[node].forEach((nodeProduct, index) => {
        if (nodeProducts[node][index].picked === false) allPicked = false;
      });
      if (allPicked) {
        const auxNodeQueue = JSON.parse(JSON.stringify(nodeQueue));
        setNodeQueue(auxNodeQueue.slice(0, -1));
      }
      setStarted(true);
    } else if (started) {
      setRouteCompleteModalPayload({ onClose: goBack });
      setRouteCompleteModalOpen(true);
    }
  }, [nodeProducts]);

  const pickUpProduct = (node, productID) => {
    nodeProducts[node].forEach((nodeProduct, index) => {
      let auxNode = nodeProducts[node];
      if (nodeProduct.productID === productID) {
        auxNode[index].picked = true;
        setNodeProducts({ ...nodeProducts, node: auxNode });
      }
    });
  };

  const centerButtonClicked = () => {
    setCenterButton(true);
  };

  const handleCenterButton = () => {
    setCenterButton(false);
  };

  return (
    <>
      <HeaderNavitagion backgroundColor={'#f1f1f1'} />
      <div className='route-simbology-container'>
        <Text variant='h5'>Simbología: </Text>
        <div className='route-simbology-item'>
          <div className='item-symbol'>
            <div className='item-box' style={{ backgroundColor: 'orange' }}> </div>
            <span className='item'>Inicio</span>
          </div>
          <div  className='item-symbol'>
            <div className='item-box' style={{ backgroundColor: '#cf5050' }}> </div>
            <span className='item'>Fin</span>
          </div>
          <div className='item-symbol'>
            <div className='item-box' style={{ backgroundColor: '#ffcbcb' }}> </div>
            <span className='item'>Ruta</span>
          </div>
        </div>
      </div>
      
      <div className='route-simulation-container' ref={canvasSizeRef}>
        {nodeQueue && nodeQueue.length > 0 && widthCanvas && <Canvas nodeQueue={nodeQueue} handleChange={handleChange} centerButton={centerButton} handleCenterButton={handleCenterButton} width={widthCanvas} height={heightCanvas} />}
      </div>
      <div className='route-paper-container'>
        <Button callbackFunction={() => centerButtonClicked()}>Centrar mapa</Button>
        

        {nodeQueue.slice().reverse().map((node, index) => {
          return (
            <div key={index}>
              {index === 0 && <Text variant='h3'>Recoge ahora</Text>}
              {index === 1 && <Text variant='h3'>Siguientes productos</Text>}
              <div key={node}>
                {nodeProducts[node].map((product) => {
                  return (<RouteItem
                    key={product}
                    product={product}
                    node={node}
                    quantity={list.products[product.product.id].quantity}
                    current={index === 0}
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