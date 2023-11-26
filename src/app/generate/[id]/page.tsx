'use server';

import { getMongoDB } from "@/components/utils/getMongo";
import { ObjectId } from 'mongodb';
import GeneratorSingleUi from "./_components/GeneratorSingleUi";

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
    const thread = await getMessages(params.id);
    return <GeneratorSingleUi messagesData={thread?.messages} savedData={thread?.saved} generationId={params.id} />;
}

