"use server";

import prisma from "@/utils/getPrisma";

/**
 * Fetches metadata for a thread.
 * @param threadId - The ID of the thread.
 * @returns A promise that resolves to the clean thread metadata.
 */
export async function fetchMetaData(threadId: string) {
    "use server";
    try {
        const thread = await prisma.thread.findUnique({
            where: {
                id: threadId
            }
        });
        const threadMeta = {} as any;
        thread?.title ? threadMeta['title'] = thread.title : null;
        if (!threadMeta) return null;
        return thread;
    } catch (err) {
        console.error("Error in fetchMetaData: ", err);
    }
}