import { fetchSource } from '@/app/_actions/_sources/fetchSource';
import { deleteSource } from '@/app/_actions/_sources/deleteSource';
import { updateSource } from '@/app/_actions/_sources/updateSource';
import Modal from './_components/Modal';


async function page({ params }: { params: { id: string } }) {

    const source = await fetchSource(params.id);

    return (
        <Modal
            _id={params.id}
            sourceData={source || {}}
            deleteSource={deleteSource}
            updateSource={updateSource}
        />
    )

}

export default page