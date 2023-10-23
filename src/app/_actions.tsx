'use server';

import { cookies } from 'next/headers';

export const getAuth = async () => {

    let authData: any;
    const cookieStore = cookies();

    // if the env is not production, use the dev auth
    authData = cookieStore.get('mkr_user') as any;

    const id = authData?.id;
    const auth = authData?.auth;

    // If the user is not logged in, return false
    if (!id || !auth) {
        return false;
    }

    console.log(authData)

    const reqUrl = `https://makerdigital.io/wp-json/makerdigital/v1/get-user-data/${id}`;

    try {

        const authorizedUser = await fetch(reqUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
            },
            next: {
                tags: ['auth'],
            }
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
        return false;
    }

}