import * as React from 'react';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme } from '@mui/material/styles';
import axios from "axios"
import { addUser } from "./../features/user.slice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const providers = [{ id: 'credentials', name: 'Email and Password' }];


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const signIn = async (providers, formData) => {
    console.log("Login Attempt")
    const email = formData.get('email')
    const password = formData.get('password')
    if(email != "" && password != "")
      axios.post('http://localhost:3000/api/user/login', {email: formData.get('email'), password: formData.get('password')})
      .then(function (response) {
        document.cookie = `token=${response.data.token}`;
        dispatch(addUser(response.data))
        navigate('/');
      })
      .catch(function (error) {
        console.log(error);
      })
  };

  const theme = useTheme();
  return (
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
  );
}
