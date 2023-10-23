'use server';

import { getAuth } from '@/app/_actions';
import { LoginButton } from '@/components/UI/LoginButton';

export const AuthProvider = async ({ children }: any) => {
    const auth = await getAuth() as any;
    if (!!auth && !!auth.active) {
        return children;
    } else {
        return (
            <>
                <div className="flex flex-col w-full min-h-screen justify-center items-center">
                    <h1 className="text-4xl font-bold">You are not authorized to view this page.</h1>
                    <LoginButton />
                </div>
            </>
        )
    }
}