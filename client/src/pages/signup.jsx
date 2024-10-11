import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from "react-router-dom"
import { addUser } from "./../features/user.slice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });


    console.log("Signup Attempt")
    const username = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    if(email != "" && password != "" && username != "")
      axios.post(`${import.meta.env.VITE_APP_DOMAIN}/api/user/signup`, {username, email, password})
      .then(function (response) {
        document.cookie = `token=${response.data.token}`;
        dispatch(addUser(response.data))
        navigate('/');
      })
      .catch(function (error) {
        console.log(error);
      })
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Username"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            <Link to="/login">
            Already have an account? Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
