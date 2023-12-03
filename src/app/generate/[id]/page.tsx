'use server';

import { getMongoDB } from "@/components/utils/getMongo";
import { ObjectId } from 'mongodb';
import GeneratorSingleUi from "./_components/GeneratorSingleUi";
import { fetchThreads, fetchTones, fetchFormulas, fetchSources, fetchMetadata } from "../_actions";

const getMessages = async (idString: any) => {
    try {
        const db = await getMongoDB() as any;
        const id = new ObjectId(idString);
        const thread = await db.collection("threads").findOne({ _id: id });
        return { messages: thread.messages, saved: thread.saved };
    } catch (error) {
        console.log(error);
    }
}

export default async function Page({ params }: { params: { id: string } }) {

    const threads = await fetchThreads();
    const tones = await fetchTones();
    const formulas = await fetchFormulas();
    const sources = await fetchSources();
    const meta = await fetchMetadata(params.id);
    const thread = await getMessages(params.id);

    return <GeneratorSingleUi
        messagesData={thread?.messages}
        savedData={thread?.saved}
        generationId={params.id}
        threads={threads || []}
        tones={tones || []}
        formulas={formulas || []}
        sources={sources || []}
        meta={meta || []} />;
}

