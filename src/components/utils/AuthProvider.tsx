'use server';

import { getAuth } from '@/app/_actions';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation'
import { getAuthUsername } from './getUsernameAuthByCookie';

export const AuthProvider = async ({ children }: any) => {

    //  ### Get the username from the cookie
    const username = getAuthUsername();

    // ### Get the user data from WP_API
    const auth = await getAuth() as any;

    //  ### Get the current URL
    const host = headers().get('host') ? headers().get('host') : 'app.makerdigital.io';
    const path = headers().get('x-invoke-path') ? headers().get('x-invoke-path') : '';
    const currentUrl = `https://${host}${path}`;

    // ### If the user is logged in and they have an active subscription, return the children
    if (!!username && !!auth.active) {
        if (process.env.NODE_ENV === 'development') console.log(`### Development mode ###\n\nAUTH: `, auth, `\n\n###\n\n`);
        return children;
    }

    // ### If the user is not logged in, redirect them to the login page
    if (!username) {
        redirect(`https://makerdigital.io/wp-login.php?redirect_to=${currentUrl}`);
    }

    // ### If the user is logged in and they do not have an active subscription, redirect them to the subscription page
    if (!!username && !auth.active) {
        redirect(`https://makerdigital.io/product/apprentice`);
    }
}