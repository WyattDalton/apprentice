import useSWR from 'swr';
import { cookies } from 'next/headers';

/**
 * Retrieves the authentication data for the logged-in user.
 * @returns {Promise<boolean | any>} A promise that resolves to the user data if the user is logged in, or false if the user is not logged in.
 */
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

    const reqUrl = `https://makerdigital.io/wp-json/makerdigital/v1/get-user-data/${id}`;

    const fetcher = async (url: string) => {
        const authorizedUser = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });

        // If the response is not 200, throw an error
        if (authorizedUser.status !== 200) {
            throw new Error('Failed to fetch user data');
        }

        // If the response is 200, return the user data
        const userData = await authorizedUser.json();

        return userData;
    };

    const { data, error } = useSWR(['auth', reqUrl], fetcher);

    if (error) {
        console.log('ERROR: ', error);
        return {
            success: false,
            coockieData: authData,
            message: error,
        };
    }

    return data;
}