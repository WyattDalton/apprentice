import { getAuthFromWP } from "./auth-2-getAuthFromWP";
import prisma from "@/utils/getPrisma";

declare global {
    var loggedInUser: any | undefined;
}

export default async function getLoggedInUser() {

    let loggedInUser: any;

    const auth = await getAuthFromWP() as any;
    const idString = auth.user.id.toString();

    if (!auth.active) {
        loggedInUser = false;
    } else {

        if (process.env.NODE_ENV === 'production') {
            loggedInUser = await prisma.user.findUnique({
                where: {
                    id: idString
                }
            });
        } else {
            if (!global.loggedInUser) {
                global.loggedInUser = await prisma.user.findUnique({
                    where: {
                        id: idString
                    }
                });
            }
            loggedInUser = global.loggedInUser;
        }

        if (!loggedInUser) {
            loggedInUser = await prisma.user.create({
                data: {
                    id: idString,
                    username: auth.user.username,
                    email: auth.user.email,
                }
            });

            if (process.env.NODE_ENV !== 'production') {
                global.loggedInUser = loggedInUser;
            }
        }
    }

    return loggedInUser;

}