'use server';

import SingleToneUi from "./_components/SingleToneUi";
import { deleteTone, getToneData, updateTone } from "../_actions";
import { getEmbedding, getInstructions, processInstructions, generateSample } from "./_actions";



/**
 * Renders a page component for a specific tone.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters object.
 * @param {string} props.params.id - The ID of the tone.
 * @returns {JSX.Element} The rendered page component.
 */
async function Page({ params }: { params: { id: string } }) {

    // Get tone data
    const data = await getToneData(params.id);


    return (
        <SingleToneUi
            // Tone data
            id={params.id}
            titleData={data.title || ''}
            examplesData={data.examples || []}
            descriptionData={data.description || ''}
            keywordsData={data.keywords || []}
            instructionsData={data.instructions || []}
            sampleData={data.sample || ''}

            // CRUD functions
            deleteTone={deleteTone}
            updateTone={updateTone}

            // Processing functions
            getEmbedding={getEmbedding}
            getInstructions={getInstructions}
            processInstructions={processInstructions}
            generateSample={generateSample}
        />
    )
}


export default Page;