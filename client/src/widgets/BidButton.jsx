import React from 'react';
import Button from '@mui/material/Button';

const BidButton = ({ price, onBid, isDisabled }) => (
  <Button size="medium" disabled={isDisabled} onClick={onBid}>
    Add Bid
  </Button>
);

export default BidButton;
