'use server';

import SingleToneUi from "./_components/SingleToneUi";
import { deleteTone, getToneData } from "../_actions";
import { getEmbedding, getInstructions, processInstructions, getKeywords, processKeywords, getDesription, processDescriptions } from "./_actions";



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

    // Transfer functions to UI
    const UIgetEmbedding = getEmbedding;
    const UIgetInstructions = getInstructions;
    const UIprocessInstructions = processInstructions;
    const UIgetKeywords = getKeywords;
    const UIprocessKeywords = processKeywords;
    const UIgetDesription = getDesription;
    const UIprocessDescriptions = processDescriptions;

    return (
        <SingleToneUi
            titleData={data.title || ''}
            examplesData={data.examples || []}
            descriptionData={data.description || ''}
            keywordsData={data.keywords || []}
            instructionsData={data.instructions || []}
            deleteTone={deleteTone}
            id={params.id}
            getEmbedding={UIgetEmbedding}
            getInstructions={UIgetInstructions}
            processInstructions={UIprocessInstructions}
            getKeywords={UIgetKeywords}
            processKeywords={UIprocessKeywords}
            getDesription={UIgetDesription}
            processDescriptions={UIprocessDescriptions}
        />
    )
}


export default Page;