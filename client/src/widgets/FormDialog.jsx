import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { socket } from "./../sockets/socket";
import axios from "axios";
import { newProduct } from "./../features/product.slice";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function FormDialog() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  useEffect(() => {
    socket.on('newProd', (data) => {
      dispatch(newProduct(data));
    });

    return () => {
      socket.off('newProd');
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} sx={{color: "white"}}>
        Add Product
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const token = getCookie('token');
              axios.post(`${import.meta.env.VITE_APP_DOMAIN}/api/product`,{
                  "Name": formJson.name,
                  "Image": formJson.image,
                  "Price": formJson.price
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
              .then(function (response) {
                const { _id, Name, Image, Price, Bidders } = response.data;
                socket.emit('newProd', { _id, Name, Image, Price, Bidders });
                dispatch(newProduct({ _id, Name, Image, Price, Bidders }));
              })
              .catch(function (error) {
                console.log(error);
              });
            handleClose();
          },
        }}
      >
        <DialogContent>
          <DialogContentText>
            Add a new product
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="image"
            name="image"
            label="Image URI (Optional)"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="price"
            name="price"
            label="Price in example: $20"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
