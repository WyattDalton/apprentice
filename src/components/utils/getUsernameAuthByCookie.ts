import { cookies } from 'next/headers';

/**
 * Returns the username of the authenticated user from the "wordpress_logged_in" cookie.
 * @returns {string|boolean} The username of the authenticated user or false if the cookie is not found.
 */
export const getAuthUsername = () => {
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
    } else if (process.env.NODE_ENV === 'development') {
        username = 'Wyatt'
    }

    return username;
}