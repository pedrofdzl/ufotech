import React, { useContext, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation, Route } from 'react-router-dom';

// Navigation
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Providers
import { ListContext } from '../providers/ListProvider';
import { ProductContext } from '../providers/ProductProvider';
import { ModalContext } from '../providers/ModalProvider';

// Components
import { ProductItem } from '../components/simulation/ProductItem';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import ProductVisualizer from '../components/simulation/ProductVisualizer.tsx'

// Stylesheets
import '../stylesheets/Route.css';

let timeOut;

const LocateProduct = () => {
  const { listID } = useParams();

  const { lists } = useContext(ListContext);
  const { categories } = useContext(ProductContext);

  const [list] = useState(lists.myLists[listID]);
  const [nodeProducts, setNodeProducts] = useState({});
  const [widthCanvas, setWidthCanvas] = useState(0);
  const [heightCanvas, setHeightCanvas] = useState(0);
  const [startCanvasY, setStartCanvasY] = useState(0);
  const [endNode, setEndNode] = useState(0);
  const [lastEndNode, setLastEndNode] = useState(0);
  const [indexLastEndNode, setIndexLastEndNode] = useState(0);
  const [needRoute, setNeedRoute] = useState(false);
  const [gotRoute, setGotRoute] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { setRouteCompleteModalOpen, setRouteCompleteModalPayload } = useContext(ModalContext);

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
  
  useLayoutEffect(() => {
    setWidthCanvas(canvasSizeRef.current.offsetWidth);
    setHeightCanvas(canvasSizeRef.current.offsetHeight);
    setStartCanvasY(canvasSizeRef.current.offsetTop);

    const handleResize = () => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        setWidthCanvas(canvasSizeRef.current.offsetWidth);
        setHeightCanvas(canvasSizeRef.current.offsetHeight);
        setStartCanvasY(canvasSizeRef.current.offsetTop);
      }, 100);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [needRoute, endNode]);

  useEffect(() => {
    window.scrollTo(0, 0);

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
      if (!Object.keys(auxNodeProducts).find((node) => node === productObject.node)) {
        auxNodeProducts[productObject.node] = [];
      }
      auxNodeProducts[productObject.node].push(auxProduct);
    });
        
    setNodeProducts(auxNodeProducts);
  }, []);

  const pickUpProduct = (node, productID) => {
    window.scrollTo(0, 0);

    nodeProducts[node].forEach((nodeProduct, index) => {
      if (nodeProduct.productID === productID) {

        if (lastEndNode) {
          let auxNode = nodeProducts[lastEndNode];
          auxNode[indexLastEndNode].picked = false;
          setNodeProducts({ ...nodeProducts, [lastEndNode]: auxNode });
        }

        let auxNode = nodeProducts[node];
        auxNode[index].picked = true;
        setEndNode(node);
        setNodeProducts({ ...nodeProducts, [node]: auxNode });
        handleNeedRoute();
        
        setLastEndNode(node);
        setIndexLastEndNode(index);
      }
    });
  };

  const needRouteButtonClicked = () => {
    setNeedRoute(true);
  };

  const handleNeedRoute = () => {
    setNeedRoute(false);
  };

  const handleGotRoute = (newValue) => {
    setGotRoute(newValue);
  };

  return (
    <>
    <HeaderNavitagion backgroundColor={'#f1f1f1'} />
    {endNode > "0" && (
      needRoute ? (
        <div className='route-simbology-container'  >
          <Text variant='h5'>Pulsa en el mapa tu ubicación actual</Text>
        </div>
      ) : (
        <div className='route-simbology-container'>
          <Text variant='h5'>Simbología: </Text>
          <div className='route-simbology-item'>
            {gotRoute ? (
              <>
                <div className='item-symbol'>
                  <div className='item-box' style={{ backgroundColor: 'orange' }}> </div>
                  <span className='item'>Inicio</span>
                </div>
                <div className='item-symbol'>
                  <div className='item-box' style={{ backgroundColor: '#ffcbcb' }}> </div>
                  <span className='item'>Ruta</span>
                </div>
                <div className='item-symbol'>
                  <div className='item-box' style={{ backgroundColor: '#cf5050' }}> </div>
                  <span className='item'>Fin</span>
                </div>
              </>
            ) : (
              <div className='item-symbol'>
                <div className='item-box' style={{ backgroundColor: '#cf5050' }}> </div>
                <span className='item'>Ubicación de producto</span>
              </div>
            )}
          </div>
        </div>
      )
    )}
    <div className='route-simulation-container' ref={canvasSizeRef}>
      {widthCanvas && <ProductVisualizer 
        endNode={parseInt(endNode)} needRoute={needRoute} handleNeedRoute={handleNeedRoute}
        handleGotRoute={handleGotRoute} startCanvasY={startCanvasY}
        width={widthCanvas} height={heightCanvas} 
      />}
    </div>
    <div className='route-paper-container'>
      {endNode > "0" && 
      (needRoute ? 
      <Button variant = {'remove-large-press'} callbackFunction={() => needRouteButtonClicked()}>Mostrar ruta a producto</Button>
      : <Button callbackFunction={() => needRouteButtonClicked()}>Mostrar ruta a producto</Button>
      )}
      
      {Object.keys(nodeProducts).map((node, index) => {
        return (
          <div key={index}>
            {index === 0 && endNode > "0" && (
              <div>
                <Text variant='h3'>Producto actual seleccionado</Text>
                {nodeProducts[endNode].map((product) => (
                  <ProductItem
                    key={product}
                    product={product}
                    node={node}
                    quantity={list.products[product.product.id].quantity}
                    callbackFunction={pickUpProduct}
                  />
                ))}
              </div>
            )}
            {index === 0 && <Text variant='h3'>Escoge producto a encontrar</Text>}
            <div key={node}>
              {node !== endNode && nodeProducts[node].map((product) => (
                <ProductItem
                  key={product}
                  product={product}
                  node={node}
                  quantity={list.products[product.product.id].quantity}
                  callbackFunction={pickUpProduct}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
};

export default LocateProduct;