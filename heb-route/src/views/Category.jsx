import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Navigators
import HeaderNavitagion from '../navigators/HeaderNavigation';

// Components
import ProductCard from '../components/products/ProductCard';

// UI
import { Text } from '../components/ui/Text';

// Providers
import { ProductContext } from '../providers/ProductProvider';

const Category = () => {
  const { categoryID } = useParams();
  const { categories } = useContext(ProductContext);

  const category = categories.categories[categoryID];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <>
      <HeaderNavitagion />
      <div className='safe-area'>
        <Text styles={{ paddingTop: 24 }} variant={'h1'}>
          {category.name} {category.emoji}
        </Text>
        <br />
        <div className='category-product-grid'>
          {category.products.map((product) => {
            return (
              <ProductCard product={product} category={categoryID}/>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Category;
