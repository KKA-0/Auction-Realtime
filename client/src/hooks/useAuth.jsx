import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addUser } from "./../features/user.slice"

const useAuthentication = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token='));
                const tokenValue = token ? token.split('=')[1] : null;

                if (tokenValue) {
                    const axiosHead = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenValue}`,
                        },
                    }
                    const response = await axios.get(`http://localhost:3000/api/user/token`, axiosHead);
                    dispatch(addUser({email: response.data.email, username: response.data.username, userId: response.data.userId}));
                    setIsAuthenticated(true);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                navigate('/login');
            }
        }

        checkAuth();
    }, [dispatch, navigate]);

    return isAuthenticated;
}

export default useAuthentication;
