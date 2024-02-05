'use client'
import { useState, useEffect } from 'react';

export const LoginButton = () => {

    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    const loginUrl = `https://makerdigital.io/wp-login.php?redirect_to=${currentUrl}`;

    const handleClick = () => {
        window.location.href = loginUrl;
    }
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>Login</button>
    )
}