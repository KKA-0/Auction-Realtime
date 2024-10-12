import React from 'react';
import CardMedia from '@mui/material/CardMedia';

const ProductImage = ({ image, name }) => (
  <>
    <CardMedia component="img" alt={name} height="140" image={image} />
  </>
);

export default ProductImage;
