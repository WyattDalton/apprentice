'use server';

import SingleToneUi from "./_components/SingleToneUi";
import { deleteTone, getToneData } from "../_actions";

async function Page({ params }: { params: { id: string } }) {

    const data = await getToneData(params.id);
    console.log(data.length)
    return (
        <SingleToneUi
            titleData={data.title || ''}
            examplesData={data.examples || []}
            descriptionData={data.description || ''}
            keywordsData={data.keywords || []}
            instructionsData={data.instructions || []}
            deleteTone={deleteTone}
            id={params.id}
        />
    )

}


export default Page;