"use server"

import { getMongoDB } from "@/utils/getMongo";
import { createChunks, getEmbedding } from "./utilities";
const pdfParse = require('pdf-parse');
const mammoth = require("mammoth");

/**
 * Adds files to the MongoDB collection.
 * @param sources An array of sources to be added.
 * @returns A Promise that resolves to an array of newly added sources.
 */
export async function addFile(data: any) {
    "use server"
    const db = await getMongoDB() as any;
    try {

        const sources = await Promise.all(data.map(async (source: any) => {

            const sourcePayload = {} as any;

            const buffer = source.buffer;
            const type = source.type;
            const name = source.name;
            const title = name.split('.').slice(0, -1).join('.');

            let content = '';
            switch (type) {
                case 'text/plain':
                    content = Buffer.from(buffer, 'base64').toString('utf-8');
                    break;
                case 'application/pdf':
                    const pdfBuffer = Buffer.from(buffer, 'base64');
                    const pdfData = await pdfParse(pdfBuffer);
                    content = await pdfData.text;
                    break;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    // use the mammoth library to extract text from docx
                    const docBuffer = Buffer.from(buffer, 'base64');
                    const result = await mammoth.extractRawText({ buffer: docBuffer.buffer });
                    content = await result.value;
                    break;
                default:
                    content = "";
            }

            const chunks = await createChunks(content) as any;
            const embeddings = await Promise.all(chunks.map((chunk: any, index: number) => getEmbedding(chunk, title, index)));

            sourcePayload.name = name;
            sourcePayload.title = title;
            sourcePayload.type = 'file';
            sourcePayload.text = content;
            sourcePayload.embeddings = embeddings;
            sourcePayload.category = 'general';


            /* * * * * * * * * * * * * */
            /* Add to MongoDB
            /* * * * * * * * * * * * * */
            const newSourceawait = await db.collection("sources").updateOne(
                { name: name, type: 'file' }, // Filter
                { $set: sourcePayload },     // Update
                { upsert: true }             // Options: if no match is found, create a new document
            );

            /* * * * * * * * * * * * * */
            /* Return new source
            /* * * * * * * * * * * * * */
            const returnSource = await db.collection("sources").findOne({
                _id: newSourceawait.upsertedId,
                type: 'file'
            },
                {
                    projection: { category: 1, name: 1, text: 1, title: 1, type: 1, _id: 1 }
                });
            const cleanedSource = { ...returnSource, _id: returnSource._id.toString() };
            return cleanedSource;

        }));


        return { "success": true, "data": "sources" };
    } catch (err) {
        return { success: false, message: err };
    }
}
