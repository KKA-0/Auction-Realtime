import React, { useEffect, useRef } from 'react';
import Cards from "./widgets/cards";
import { socket } from "./sockets/socket"; // Ensure socket connection is initialized somewhere
import useAuthentication from './hooks/useAuth';
import { fetchProducts } from "./features/product.slice";
import { useDispatch, useSelector } from 'react-redux';

export default function Home() {
  const isAuthenticated = useAuthentication();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  

  useEffect(() => {
      dispatch(fetchProducts());
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>  
    <div style={{display: "flex", flexWrap: "wrap"}}>
      {loading ? (
        
        <p>Loading...</p>
      ) : (
        Object.values(products).map((item, index) => (
          <Cards product={item} key={item._id} />
      ))
      )}
      </div>
    </>
  );
}
