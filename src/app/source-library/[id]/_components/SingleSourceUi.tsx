'use client'

import { useState } from 'react';
import Source from './Source';

type SourceData = {
    _id: string,
    name: string,
    title: string,
    type: string,
    text: string,
}

async function SingleSourceUi({ _id, name, title, type, text }: SourceData) {

    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (updatedData: any) => {

        try {
            setUpdating(true)
            console.log('Start updating: ', updating)
            const payload = {
                'dataType': 'update',
                'data': [updatedData]
            }

            const source = await fetch(`/api/sourcesUpdate`, {
                method: "POST",
                body: JSON.stringify(payload),
                cache: 'no-store',
            });

            if (!source.ok) throw new Error('Error updating source');

            const sourceData = await source.json();
            console.log(sourceData)
            setUpdating(false)
            console.log('End updating: ', updating)
            return sourceData;

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Source handleUpdate={handleUpdate} updating={updating} _id={_id} name={name} title={title} type={type} text={text} />
    )

}

export default SingleSourceUi