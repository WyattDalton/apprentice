'use server';

import { ObjectId } from "mongodb";
import { getMongoDB } from "@/components/utils/getMongo";
import SingleToneUi from "./_components/SingleToneUi";

const getToneData = async (id: string) => {
    try {
        const db = await getMongoDB() as any;
        const _id = new ObjectId(id);
        const tone = await db.collection("tones").findOne({ _id: _id });
        const cleanTone = { _id: tone._id.toString(), ...tone };

        const payload = {} as any;

        !!cleanTone.title ? payload.title = cleanTone.title : false;
        !!cleanTone.examples ? payload.examples = cleanTone.examples : false;
        !!cleanTone.description ? payload.description = cleanTone.description : false;
        !!cleanTone.keywords ? payload.keywords = cleanTone.keywords : false;
        !!cleanTone.instructions ? payload.instructions = cleanTone.instructions : false;

        return payload;
    } catch (error: any) {
        console.error('Error in GET:', error.message);
    }
}


async function Page({ params }: { params: { id: string } }) {

    const data = await getToneData(params.id);

    return (
        <SingleToneUi
            titleData={data.title || ''}
            examplesData={data.examples || []}
            descriptionData={data.description || ''}
            keywordsData={data.keywords || []}
            instructionsData={data.instructions || []}
            id={params.id}
        />
    )

}


export default Page;