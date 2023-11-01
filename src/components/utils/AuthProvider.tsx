'use server';

import { getAuth } from '@/app/_actions';
import { LoginButton } from '@/components/UI/LoginButton';
import { cookies } from 'next/headers';





export const AuthProvider = async ({ children }: any) => {
    const auth = await getAuth() as any;
    const cookieStore = cookies();

    // get a cookie that contains the substring "wordpress_logged_in"
    const allCookies = cookieStore.getAll()
    const loggedInCookie = allCookies.find((cookie) => {
        if (cookie.name.includes('wordpress_logged_in')) {
            return JSON.parse(cookie.value);
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

    let username = '';
    if (!!loggedInCookie) {
        username = extractUsername(loggedInCookie.value);
    }

    const makr_cookie = cookieStore.get('mkr_user');
    const makr_user = makr_cookie ? JSON.parse(makr_cookie.value) : null;
    if (!!auth && !!auth.active) {
        return children;
    } else {
        return (
            <>
                <pre>
                    {loggedInCookie?.toString()}
                    {username}
                    {makr_user?.toString()}
                </pre>
                <div className="flex flex-col w-full min-h-screen justify-center items-center">
                    <h1 className="text-4xl font-bold">You are not authorized to view this page.</h1>
                    <LoginButton />
                </div>
            </>
        )
    }
}