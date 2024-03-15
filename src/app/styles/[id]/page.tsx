'use server';

import SingleStyleUi from "./_components/SingleStyleUi";
import { deleteStyle, getStyleData, updateStyle } from "../_actions";
import { getEmbedding, getInstructions, generateBlueprint, generateSample, generateComparison } from "./_actions";



/**
 * Renders a page component for a specific style.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters object.
 * @param {string} props.params.id - The ID of the style.
 * @returns {JSX.Element} The rendered page component.
 */
async function Page({ params }: { params: { id: string } }) {

    // Get style data
    const data = await getStyleData(params.id);

    return (
        <SingleStyleUi
        // Style data
            id={params.id}
            titleData={data.title || ''}
            examplesData={data.examples || []}
            descriptionData={data.description || ''}
            keywordsData={data.keywords || []}
            bluePrintData={data.bluePrint || []}
            sampleData={data.sample || ''}
            iterationData={data.iteration || []}

            // CRUD functions
            deleteStyle={deleteStyle}
            updateStyle={updateStyle}

            // Processing functions
            getEmbedding={getEmbedding}
            getInstructions={getInstructions}
            generateBlueprint={generateBlueprint}
            generateSample={generateSample}
            generateComparison={generateComparison}
        />
    )
}


export default Page;