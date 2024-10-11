// Cards.js
import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { socket } from './../sockets/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProductImage from './../widgets/ProductImage';
import BidTimer from './../widgets/BidTimer';
import BidButton from './../widgets/BidButton';
import BidderList from './../widgets/BidderList';
import Button from '@mui/material/Button';
import { useDispatch } from "react-redux" 
import { newProduct } from "./../features/product.slice"

export default function Cards({ product }) {
  const dispatch = useDispatch()
  const [price, setPrice] = useState(product.Price || 0);
  const [time, setTime] = useState(30);
  const [Bidder, setBidder] = useState([]);
  const [lastBidder, setLastBidder] = useState(null);
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username);
  const [currentUser] = useState(userId);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }

  const handleBidAPI = async ({ productId, userId, price, username }) => {
    const token = getCookie('token');
    try {
      const response = await axios.patch(`${import.meta.env.VITE_APP_DOMAIN}/api/product/bid/${productId}`, {
        newBid: {
          userId,
          username,
          Price: price,
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (product && product.Bidders) {
      setBidder((prevBidder) => {
        const existingBidders = new Set(prevBidder);
        const newBidders = product.Bidders.map(bid => bid.username || 'Unknown User')
          .filter(username => !existingBidders.has(username));
        return [ ...prevBidder, ...newBidders.reverse()];
      });
    }
  }, [product]);

  useEffect(() => {
    const handleBidEvent = ({ productId, userId, price, username }) => {
      if (productId === product._id) {
        resetTimer();
        setPrice(price);
        setLastBidder(userId);
        setBidder(prevBidder => [username, ...prevBidder]);
      }
    };

    socket.on('bid', handleBidEvent);

    return () => {
      socket.off('bid', handleBidEvent);
    };
  }, [product._id]);

  useEffect(() => {
    const handleAddprod = (data) => {
      dispatch(newProduct(data))
    };

    socket.on('newProd', handleAddprod);

    return () => {
      socket.off('newProd', handleAddprod);
    };
  }, [product._id]);

  const handleAddBid = () => {
    const newPrice = price + 5;
    socket.emit('bid', { productId: product._id, userId: currentUser, price: newPrice, username });
    setPrice(newPrice);
    setLastBidder(currentUser);
    handleBidAPI({ productId: product._id, userId: currentUser, price: newPrice, username });
  };

  const handleBuy = () => {
    console.log("Product bought by:", currentUser);
  };

  const resetTimer = () => {
    setTime(30);
  };

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }else{
      const findWinner = async () => {
      const token = getCookie('token');
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_DOMAIN}/api/product/bid/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setLastBidder(response.data.lastBid.userId) 
      } catch (error) {
        console.error(error);
      }

      }
      findWinner()
    }
  }, [time]);

  return (
    <Card sx={{ maxWidth: 345, margin: '10px' }}>
      <ProductImage image={product.Image} name={product.Name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.Name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {/* Product description here */}
        </Typography>
      </CardContent>
      <BidTimer time={time} />
      <BidButton price={price} onBid={handleAddBid} isDisabled={time === 0} />
      {lastBidder === currentUser && time === 0 && (
        <Button size="medium" color="primary" onClick={handleBuy}>
          Buy
        </Button>
      )}
      <BidderList bidders={Bidder} />
    </Card>
  );
}
