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

export default function Cards({ product }) {
  const [price, setPrice] = useState(product.Price || 0);
  const [time, setTime] = useState(30);
  const [Bidder, setBidder] = useState([]);
  const [lastBidder, setLastBidder] = useState(null);
  const [buyTimer, setBuyTimer] = useState(0);
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
      socket.emit('bid', { productId, userId, price, username });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const currentTime = new Date();
    const lastBidDeadline = new Date(product.lastBidAt);
    lastBidDeadline.setSeconds(lastBidDeadline.getSeconds() + 30);

    // Check if the auction has ended
    if (currentTime > lastBidDeadline) {
      setTime(0);
    }

    // Calculate remaining buy timer
    const lastBidPlusTenMins = new Date(product.lastBidAt);
    lastBidPlusTenMins.setMinutes(lastBidPlusTenMins.getMinutes() + 10);
    
    // Calculate the remaining buy timer
    const remainingBuyTime = Math.max(0, Math.floor((lastBidPlusTenMins - currentTime) / 1000));

    if (remainingBuyTime > 0) {
      setBuyTimer(remainingBuyTime);
    }

    if (product && product.Bidders) {
      setBidder((prevBidder) => {
        const existingBidders = new Set(prevBidder);
        const newBidders = product.Bidders.map(bid => bid.username || 'Unknown User')
          .filter(username => !existingBidders.has(username));
        return [...prevBidder, ...newBidders.reverse()];
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

  const handleAddBid = () => {
    const newPrice = price + 5;
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
    } else {
      const findWinner = async () => {
        const token = getCookie('token');
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_DOMAIN}/api/product/bid/${product._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          setLastBidder(response.data.lastBid.userId);
        } catch (error) {
          console.error(error);
        }
      };
      findWinner();
    }
  }, [time]);

  useEffect(() => {
    if (buyTimer > 0) {
      const timer = setTimeout(() => {
        setBuyTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [buyTimer]);

  const isBuyButtonDisabled = buyTimer === 0;

  return (
      <Card
        sx={{
          maxWidth: 345,
          margin: '10px',
          minWidth: 325,
          boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset'
        }}
      >
      <ProductImage image={product.Image || "https://st4.depositphotos.com/14953852/22772/v/450/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"} name={product.Name} />
      
      {
        time > 0 && (
          <Typography sx={{ color: 'red', margin: "5px" }} size="medium">Live</Typography>
        )
      }
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.Name}
        </Typography>
      <BidTimer time={time} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          $ {price.toFixed(2)}
        </Typography>
      </CardContent>
      {lastBidder === currentUser && time === 0 && isBuyButtonDisabled === false && (
        <Button size="medium" color="primary" onClick={handleBuy}>
          Buy
        </Button>
      )}
      <BidButton price={price} onBid={handleAddBid} isDisabled={time === 0} />
      {lastBidder === currentUser && time === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Buy button available for: {Math.floor(buyTimer / 60)}:{(buyTimer % 60).toString().padStart(2, '0')}
        </Typography>
      )}
      <BidderList bidders={Bidder} />
    </Card>
  );
}
