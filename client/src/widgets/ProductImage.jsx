import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const ProductImage = ({ image, name }) => (
  <>
    <CardMedia component="img" alt={name} height="140" image={image} />
    <Typography sx={{ color: 'red' }} size="medium">Live</Typography>
  </>
);

export default ProductImage;
