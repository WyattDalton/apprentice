import { closeMongoDB, getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';
import Source from './_components/Source';
import { revalidatePath } from 'next/cache'


async function fetchData(idString: string) {
    try {
        const id = new ObjectId(idString);
        const db = await getMongoDB() as any;
        const source = await db.collection("sources").findOne({ _id: id });
        return source;
    } catch (error) {
        return { success: false, message: error }
    }
};
async function handleUpdate(updatedData: any) {
    'use server';
    try {

        const payload = {
            'dataType': 'update',
            'data': [updatedData]
        }

        const { signal } = new AbortController()
        const api = process.env.API_URL;
        const source = await fetch(`${api}/sourcesUpdate`, {
            method: "POST",
            body: JSON.stringify(payload),
            next: { revalidate: 1 }
        });

        if (!source.ok) throw new Error('Error updating source');

        revalidatePath(`/source-library/${updatedData._id}`);
        revalidatePath(`/source-library/`);


    } catch (error) {
        console.log(error);
    }
}


async function page({ params }: { params: { id: string } }) {

    const data = await fetchData(params.id);
    const { name, title, type, text } = data as any;

    return (
        <Source handleUpdate={handleUpdate} _id={params.id} name={name} title={title} type={type} text={text} />
    )

}

export default page