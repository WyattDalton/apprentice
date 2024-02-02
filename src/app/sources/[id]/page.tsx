import SingleSourceUi from './_components/SingleSourceUi';
import { fetchSource, deleteSource, updateSource } from '../_actions';

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