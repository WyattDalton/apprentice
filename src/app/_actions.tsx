'use server';

import { getUserData } from '@/components/utils/getUserData';
import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';

// ###
// ### Get mongo client
export const getMongoDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URL as string);

    // Get User Data
    const rawUserData = await getUserData();
    const userId = rawUserData.userId.toString().toLowerCase().replace(/ /g, '_');
    const userOrganization = rawUserData.organization
        .toLowerCase()
        .replace(/ /g, '_');
    const _mongoUserId = `${userId}-${userOrganization}`;

    // Get mongodb client
    await client.connect();
    const db = client.db(_mongoUserId);
    return db;
};

/**
 * Retrieves the authenticated user data from the Maker Digital API.
 * If the environment is not production, it uses the dev auth.
 * @returns {Promise<any>} A promise that resolves to the user data if successful, or false if unsuccessful.
 */
export const getAuth = async () => {

    // check if userData has already been set, and if it has, returned the cached data

    let authData: any;
    const cookieStore = cookies();

    // if the env is not production, use the dev auth
    if (process.env.NODE_ENV !== 'production') {
        authData = {
            'id': process.env.DEV_AUTH_ID,
            'auth': process.env.DEV_AUTH_TOKEN,
        }
    } else {
        authData = cookieStore.get('mkr_user') as any;
    }

    const id = authData?.id;
    const auth = authData?.auth;

    const reqUrl = `https://makerdigital.io/wp-json/makerdigital/v1/get-user-data/${id}`;

    try {

        const authorizedUser = await fetch(reqUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
            },
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