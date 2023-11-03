'use server';

import { getAuth } from '@/app/_actions';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation'

export const AuthProvider = async ({ children }: any) => {

    // ### Get all cookies
    const cookieStore = cookies();

    // ### Get a cookie that contains the substring "wordpress_logged_in"
    const allCookies = cookieStore.getAll()
    const loggedInCookie = allCookies.find((cookie) => {
        if (cookie.name.includes('wordpress_logged_in')) {
            return cookie.value;
        } else {
            return false;
        }
    });

    // ### Build function to extract the username from the cookie value
    function extractUsername(cookieValue: string) {
        let parts = cookieValue.split('|');
        return parts[0];
    }

    // ### Get the username from the cookie
    let username = false as any;
    if (!!loggedInCookie) {
        username = extractUsername(loggedInCookie.value);
    }

    //  ### Get the current URL
    const host = headers().get('host') ? headers().get('host') : 'app.makerdigital.io';
    const path = headers().get('x-invoke-path') ? headers().get('x-invoke-path') : '';
    const currentUrl = `https://${host}${path}`;

    const auth = await getAuth() as any;

    // ### If the user is logged in and they have an active subscription, return the children
    if (process.env.NODE_ENV === 'development' || !!username && !!auth.active) {
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