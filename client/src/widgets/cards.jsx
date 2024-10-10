import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Cards() {
  return (
    <Card sx={{ maxWidth: 345, margin: "10px" }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="https://media.istockphoto.com/id/1252455620/photo/golden-retriever-dog.webp?s=2048x2048&w=is&k=20&c=90NzwkaEprx0mE6wS2hgDhtBasYTZ6FUq7efdvlR__8="
      />
        <Typography sx={{color: "red"}} size="medium">Live</Typography>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            Charming Labrador Retriever for Auction
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        A friendly and playful Labrador, 2 years old, fully vaccinated, and eager for a loving home!
        </Typography>
      </CardContent>
      <CardActions>
        <Typography size="medium">Timer: 20 Secs</Typography>
        <Button size="large">$5</Button>
        <Button size="medium">Bid</Button>
      </CardActions>
    </Card>
  );
}
