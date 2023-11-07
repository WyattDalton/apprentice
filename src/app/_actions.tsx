'use server';
import { cookies } from 'next/headers';

export const getAuth = async () => {

    let authData: any;
    const cookieStore = cookies();

    // get a cookie that contains the substring "wordpress_logged_in"
    const allCookies = cookieStore.getAll()
    const loggedInCookie = allCookies.find((cookie) => {
        return cookie.name.includes('wordpress_logged_in');
    });

    function extractUsername(cookieValue: string) {
        // Split the string by the pipe character
        let parts = cookieValue.split('|');
        return parts[0];
    }

    let username = false as any;
    if (!!loggedInCookie) {
        username = extractUsername(loggedInCookie.value);
    }

    let reqUrl = `https://makerdigital.io/wp-json/makerdigital/v1/get-user-data/${username}`;

    // If the user is not logged in, return false
    if (process.env.NODE_ENV === 'development') {
        reqUrl = `https://makerdigital.io/wp-json/makerdigital/v1/get-user-data/wy-att`;
    } else if (!username) {
        return false;
    }

    try {

        const authorizedUser = await fetch(reqUrl, {
            method: 'GET',
            headers: {
                'Authorization': process.env.WP_API_AUTH as string,
            },
            cache: 'no-store',
        })

        // If the response is not 200, return false
        if (authorizedUser.status !== 200) {
            return false;
        }

        // If the response is 200, return the user data
        const userData = await authorizedUser.json();

        return userData;
    } catch (err) {
        console.log('ERROR: ', err);
        return {
            success: false,
            coockieData: authData,
            message: err,
        };
    }

}