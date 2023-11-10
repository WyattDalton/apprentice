'use server';
import SourcesUi from './_components/SourcesUi';
import { getMongoDB } from '@/components/utils/getMongo';

export default async function Page() {

    async function getAllSources() {
        try {
            const db = await getMongoDB() as any;
            const sources = await db.collection("sources").find({}).toArray();
            const cleanSources = sources.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));

            return cleanSources;
        } catch (error: any) {
            console.log(error)
        }
    }

    const sources = await getAllSources();

    return (
        <SourcesUi sources={sources} />
    )
}