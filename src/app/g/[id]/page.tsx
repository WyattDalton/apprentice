'use server';
import { fetchFormulas } from "@/app/_actions/_formulas/fetchFormulas";
import { fetchSources } from "@/app/_actions/_sources/fetchSources";
import { fetchMetaData } from "@/app/_actions/_threads/fetchMetaData";
import { fetchThreads } from "@/app/_actions/_threads/fetchThreads";
import { getTitle } from "@/app/_actions/_threads/getTitle";
import { saveThread } from "@/app/_actions/_threads/saveThread";
import { updateThread } from "@/app/_actions/_threads/updatethread";
import { fetchTones } from "@/app/_actions/_tones/fetchTones";
import Generator from "@/app/g/_components/Generator";
import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from 'mongodb';

/**
 * Retrieves messages from the database for a given ID.
 * @param idString - The ID of the thread as a string.
 * @returns An object containing the messages and saved status of the thread.
 */
const getMessages = async (idString: any) => {
    try {
        const db = await getMongoDB() as any;
        const id = new ObjectId(idString);
        const thread = await db.collection("threads").findOne({ _id: id });
        const cleanThread = { _id: thread._id.toString(), ...thread };
        return { messages: cleanThread.messages, saved: cleanThread.saved };
    } catch (error) {
        console.log(error);
    }
}

/**
 * Renders the page component for a specific ID.
 * 
 * @param params - The parameters object containing the ID.
 * @returns The Generator component with the necessary props.
 */
export default async function Page({ params }: { params: { id: string } }) {
    const threads = await fetchThreads();
    const tones = await fetchTones();
    const formulas = await fetchFormulas();
    const sources = await fetchSources();
    const meta = await fetchMetaData(params.id);
    const thread = await getMessages(params.id);

    return <Generator
        initConversation={thread?.messages}
        savedData={thread?.saved}
        generationId={params.id}
        threadsData={threads}
        tonesData={tones}
        formulasData={formulas}
        sources={sources}
        metaData={meta}
        fetchMetaData={fetchMetaData}
        saveThread={saveThread}
        getTitle={getTitle}
        updateThread={updateThread}
    />
}

