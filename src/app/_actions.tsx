'use server';

import { getAuthUsername } from "@/components/utils/getUsernameAuthByCookie";

export const getAuth = async () => {

    let authData: any;

    //  ### Get the username from the cookie
    const username = getAuthUsername();
    authData = username;

    //  ### If there is no username, return false
    if (!username) return false;

    // ### Create the url to get the user data
    let reqUrl = `https://makerdigital.io/wp-json/makerdigital/v1/get-user-data/${username}`;

    // ### Get the user data from WP_API
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