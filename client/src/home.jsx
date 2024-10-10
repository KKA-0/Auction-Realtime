import React from 'react'
import Cards from "./widgets/cards"
import { socket } from "./sockets/socket"
import useAuthentication from './hooks/useAuth';

export default function Home() {
  const isAuthenticated = useAuthentication();
  if (!isAuthenticated) return null;
  return (
    <>
        <Cards/>
    </>
  )
}
