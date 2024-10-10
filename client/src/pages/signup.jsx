import * as React from 'react';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

const signIn = async (provider, formData) => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      alert(
        `Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}`,
      );
      resolve();
    }, 300);
  });
  return promise;
};

export default function Login() {
  const theme = useTheme();
  return (
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
  );
}
