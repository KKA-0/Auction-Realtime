import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { socket } from './../sockets/socket';
import { useSelector } from 'react-redux';

export default function Cards({ product }) {
  const [price, setPrice] = useState(product.Price);
  const [time, setTime] = useState(30);
  const [Bidder, setBidder] = useState(["karan"]);
  const [lastBidder, setLastBidder] = useState(null); 
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username);
  const [currentUser] = useState(userId);
  useEffect(() => {
    socket.on('bid', ({ productId, userId, price, username }) => {
      if (productId === product._id) {
        resetTimer();
        setPrice(price);
        setLastBidder(userId);
        setBidder(prevBidder => [username, ...prevBidder]);
      }
    });

    return () => {
      socket.off('bid');
    };
  }, [product._id]);

  const handleAddBid = () => {
    const newPrice = price + 5;
    socket.emit('bid', { productId: product._id, userId: currentUser, price: newPrice, username });
    setPrice(newPrice); // Optimistic UI update
    setLastBidder(currentUser); // Set the current user as the last bidder
  };

  const handleBuy = () => {
    // Handle the buy action
    console.log("Product bought by:", currentUser);
  };

  const resetTimer = () => {
    setTime(30);
  };

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [time]);

  return (
    <Card sx={{ maxWidth: 345, margin: '10px' }}>
      <CardMedia
        component="img"
        alt={product.Name}
        height="140"
        image={product.Image}
      />
      {time !== 0 ? (
        <Typography sx={{ color: 'red' }} size="medium">
          Live
        </Typography>
      ) : null}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.Name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {/* Product description here */}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography size="medium">Timer: {time} Secs</Typography>
        <Button size="large">${price}</Button>
        <Button size="medium" disabled={time === 0} onClick={handleAddBid}>
          Add Bid
        </Button>
        {lastBidder === currentUser && time === 0 ? (
          <Button size="medium" color="primary" onClick={handleBuy}>
            Buy
          </Button>
        ) : null}
      </CardActions>
      <div style={{ width: '100%', height: '100px', overflowY: 'scroll' }}>
      {
        Bidder.map((item, key) => <div key={key} style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
        <span>{item}</span>
      </div>)
      }
      </div>
    </Card>
  );
}
