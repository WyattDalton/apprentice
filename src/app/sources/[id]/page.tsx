import SingleSourceUi from './_components/SingleSourceUi';
import { fetchSource } from '@/app/_actions/_sources/fetchSource';
import { deleteSource } from '@/app/_actions/_sources/deleteSource';
import { updateSource } from '@/app/_actions/_sources/updateSource';

async function page({ params }: { params: { id: string } }) {

    const source = await fetchSource(params.id);

    return (
        <SingleSourceUi
            _id={params.id}
            sourceData={source || {}}
            deleteSource={deleteSource}
            updateSource={updateSource}
        />
    )

}

export default page