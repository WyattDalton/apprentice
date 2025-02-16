'use server';

// Import the necessary functions from _actions.
import { fetchFormulas } from "@/app/_actions/_formulas/fetchFormulas";
import { fetchSources } from "@/app/_actions/_sources/fetchSources";
import { fetchMetaData } from "@/app/_actions/_threads/fetchMetaData";
import { fetchThreads } from "@/app/_actions/_threads/fetchThreads";
import { getTitle } from "@/app/_actions/_threads/getTitle";
import { saveThread } from "@/app/_actions/_threads/saveThread";
import { updateThread } from "@/app/_actions/_threads/updatethread";
import { fetchStyles } from "@/app/_actions/_styles/fetchStyles";
import { retrieveSources } from "@/app/_actions/_generator/retrieveSources";
import { retrievePromptEmbedding } from "@/app/_actions/_generator/retrievePromptEmbedding";
import prisma from "@/utils/getPrisma";

// Import the Generator component.
import Generator from "@/app/g/_components/Generator";


/**
 * Retrieves messages from the database for a given ID.
 * @param idString - The ID of the thread as a string.
 * @returns An object containing the messages and saved status of the thread.
 */
const getMessages = async (idString: any) => {
    try {
        const thread = await prisma.thread.findUnique({
            where: {
                id: idString
            }
        })
        const messages = thread?.messages;
        return { messages: messages };
    } catch (error) {
        console.log(error);
    }
}

/**
 * Retrieves threads from the database based on the provided ID.
 * @param idString - The ID of the thread to retrieve.
 * @returns An array of threads matching the provided ID, or null if an error occurs.
 */
const getThreads = async (idString: any) => {
    try {
        const threadsData = await prisma.thread.findUnique({
            where: {
                id: idString
            }
        });
        return threadsData.threads;
    } catch (err) {
        return null;
    }
}

/**
 * Renders the page component for a specific ID.
 * 
 * @param params - The parameters object containing the ID.
 * @returns The Generator component with the necessary props.
 */
export default async function Page({ params }: { params: { id: string } }) {

    const threads = await getThreads(params.id);
    const styles = await fetchStyles();
    const formulas = await fetchFormulas();
    const sources = await fetchSources();
    const meta = await fetchMetaData(params.id);
    const conversation = await getMessages(params.id);

    return <Generator
        generationId={params.id}
        initConversation={conversation?.messages}
        savedData={false}
        threadsData={threads}
        metaData={meta}
        stylesData={styles}
        formulasData={formulas}
        sourcesData={sources}
        fetchMetaData={fetchMetaData}
        saveThread={saveThread}
        getTitle={getTitle}
        updateThread={updateThread}
        retrieveSources={retrieveSources}
        retrievePromptEmbedding={retrievePromptEmbedding}
    />
}

