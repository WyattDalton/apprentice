import { getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';
import SingleSourceUi from './_components/SingleSourceUi';


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



async function page({ params }: { params: { id: string } }) {

    const data = await fetchData(params.id);
    const { name, title, type, text } = data as any;

    return (
        <SingleSourceUi _id={params.id} name={name} title={title} type={type} text={text} />
    )

}

export default page