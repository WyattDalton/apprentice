'use server';

import SingleStyleUi from "./_components/SingleStyleUi";
import { getStyleData } from "@/app/_actions/_styles/getStyleData";
import { deleteStyle } from "@/app/_actions/_styles/deleteStyle";
import { updateStyle } from "@/app/_actions/_styles/updateStyle";
import { getEmbedding } from "@/app/_actions/_styles/getEmbedding";
import { getInstructions } from "@/app/_actions/_styles/getInstructions";
import { generateBlueprint } from "@/app/_actions/_styles/generateBlueprint";
import { generateSample } from "@/app/_actions/_styles/generateSample";
import { generateComparison } from "@/app/_actions/_styles/generateComparison";

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

    console.log(data);

    return (

        <SingleStyleUi
        // Style data
            id={params.id}
            titleData={data.title || ''}
            examplesData={data.examples || []}
            descriptionData={data.description || ''}
            keywordsData={data.keywords || []}
            blueprintData={data.blueprint || []}
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