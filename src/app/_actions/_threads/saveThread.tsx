'use server';
import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

/**
 * Saves a thread to the database.
 * @param data - The data of the thread to be saved.
 * @returns The updated thread document from the database.
 */
export async function saveThread(data: any) {
    'use server';
    try {

        let thread;
        const user = await getLoggedInUser();
        const userId = user.id;

        // ### 
        // ### Dynamic data
        const saved = data.saved ? data.saved : null;
        const messages = data.messages ? data.messages : null;
        const genThreads = data.threads ? data.threads : null;

        // ###
        // ### Init setup data
        const initial_prompt = data.initial_prompt ? data.initial_prompt : null;
        const created = data.created ? data.created : null;
        const id = !!data.id ? data.id : null;

        // ###
        // ### Init payload
        const payload = {} as any;
        if (!!saved) saved == 'true' ? payload['saved'] = true : payload['saved'] = false;
        if (!!messages) payload['messages'] = messages;
        if (!!genThreads) payload['threads'] = genThreads;
        if (!!initial_prompt) payload['initial_prompt'] = initial_prompt;

        if (!!id) {
            thread = await prisma.thread.update({
                where: {
                    id: id
                },
                data: payload
            });
        } else {
            payload.userId = userId;
            thread = await prisma.thread.create({
                data: payload
            });
        }
        return thread;
    } catch (err) {
        console.error("Error in saveThread: ", err);
        return null;
    }
}