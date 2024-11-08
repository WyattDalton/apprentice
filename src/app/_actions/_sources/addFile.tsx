"use server"

import prisma from "@/utils/getPrisma";
import getLoggedInUser from "@/utils/getLoggedInUser";

import { createChunks, getEmbedding } from "./utilities";
const pdfParse = require('pdf-parse');
const mammoth = require("mammoth");

/**
 * Adds files to the DB.
 * @param sources An array of sources to be added.
 * @returns A Promise that resolves to an array of newly added sources.
 */
export async function addFile(data: any) {
    "use server"
    const user = await getLoggedInUser();
    const userId = user.id;
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
            sourcePayload.userId = userId;

            /* * * * * * * * * * * * * */
            /* Add to Prisma
            /* * * * * * * * * * * * * */

            const newSource = await prisma.source.create({
                data: sourcePayload
            })

            /* * * * * * * * * * * * * */
            /* Return new source
            /* * * * * * * * * * * * * */
            return newSource;

        }));


        return { "success": true, "data": "sources" };
    } catch (err) {
        return { success: false, message: err };
    }
}
