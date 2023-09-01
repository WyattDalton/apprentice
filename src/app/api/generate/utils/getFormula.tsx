

/// TEMPLATIZE FUNCTION
export async function templatize(_id: any, formulaLibrary: any) {
    try {
        // Get formula object from formulaLibrary by finding the "_id" key
        const t = formulaLibrary.find((formula: any) => formula._id === _id);

        if (!t) {
            return { "success": false, "message": "Formula not found!" };
        }

        // Get template from formula object
        let formulaString = t.formula;

        // Get instructions and examples
        const instructions = t.instructions || [];

        // Format template with instructions and examples
        for (const instruction of instructions) {
            const instruction_title = instruction.title;
            const instruction_content = instruction.instruction;
            const example_list = instruction.examples || [];

            // Format instruction with examples (if available)
            let formatted_instruction = "";
            if (example_list.length) {
                formatted_instruction = `<(${instruction_content} -- ${example_list.map((example: any) => `<example: ${example}>`).join(" ")})>`;
            } else {
                formatted_instruction = `<(${instruction_content})>`;
            }

            // Replace template substring with formatted instruction
            formulaString = formulaString.replace(`<${instruction_title}>`, formatted_instruction);
        }

        return { "templatizedMessage": formulaString, "instructions": instructions };
    } catch (error) {
        console.error("Error in templatize function:", error);
        return { "success": false, "message": "An error occurred!" };
    }
}
