'use server';

import { getAuth } from '@/app/_actions';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation'

export const AuthProvider = async ({ children }: any) => {

    const cookieStore = cookies();

    // get a cookie that contains the substring "wordpress_logged_in"
    const allCookies = cookieStore.getAll()
    const loggedInCookie = allCookies.find((cookie) => {
        if (cookie.name.includes('wordpress_logged_in')) {
            return cookie.value;
        } else {
            return false;
        }
    });

    // Extract the username from the cookie value
    function extractUsername(cookieValue: string) {
        // Split the string by the pipe character
        let parts = cookieValue.split('|');
        return parts[0];
    }

    let username = false as any;
    if (!!loggedInCookie) {
        username = extractUsername(loggedInCookie.value);
    }

    //  If the username does not exist, reditrect the user to this URL: `https://makerdigital.io/wp-login.php?redirect_to=app.makerdigital.io`
    const host = headers().get('host')
    const path = headers().get('x-invoke-path')
    const currentUrl = `${host}${path}`;

    if (!!username || process.env.NODE_ENV === 'development') {
        const auth = await getAuth() as any;
        console.log(auth)
        return children;
    }
    if (!username) {
        redirect(`https://makerdigital.io/wp-login.php?redirect_to=${currentUrl}`);
        return;
    }
}