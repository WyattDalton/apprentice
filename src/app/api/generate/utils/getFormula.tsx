

/// TEMPLATIZE FUNCTION
export async function templatize(_id: any, formulaLibrary: any) {
    try {
        // Get formula object from formulaLibrary by finding the "_id" key
        const t = formulaLibrary.find((formula: any) => formula.id === _id) || formulaLibrary.find((formula: any) => formula.title === _id);

        if (!t) {
            return { "success": false, "message": "Formula not found!" };
        }

        // Get template from formula object
        let formulaString = t.formula;

        // Get instructions and examples
        const instructions = t.instructions || [];

        let returnString = "";

        // Format template with instructions and examples
        instructions.forEach((instruction: any, index: any) => {

            let position = '';
            if (index === 0) {
                position = 'first';
            } else if (index === instructions.length - 1) {
                position = 'last';
            } else {
                position = 'then';
            }

            const title = instruction.title;
            const content = instruction.instruction;
            let example = !!instruction.example ? instruction.example : false;
            if (!example) example = !!instruction.examples ? instruction.examples[0] : false;

            // Format instruction with examples (if available)
            let formatted_instruction = `${position}, ${content}`;
            if (!!example) formatted_instruction += `(for example: ${example})`;
            formatted_instruction += `\n\n`;

            returnString += formatted_instruction;
        });

        return { "templatizedMessage": returnString, "instructions": instructions };
    } catch (error) {
        console.error("Error in templatize function:", error);
        return { "success": false, "message": "An error occurred!" };
    }
}
