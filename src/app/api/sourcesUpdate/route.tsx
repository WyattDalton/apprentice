import { NextRequest, NextResponse } from 'next/server'
import { getMongoDB } from '@/components/utils/getMongo';
import { ObjectId } from 'mongodb';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const mammoth = require("mammoth");
const pdfParse = require('pdf-parse');

export async function POST(req: NextRequest) {

    /* * * * * * * * * * * * * */
    /* Create Chunks
    /* * * * * * * * * * * * * */

    function createChunks(text: string) {
        try {
            const words = text.split(/\s+/);
            const chunkSize = 215;
            const overlapSize = Math.floor(chunkSize * 0.2);
            const chunks = [];

            for (let i = 0; i < words.length; i += chunkSize - overlapSize) {
                chunks.push(words.slice(i, i + chunkSize).join(' '));
            }

            return chunks;
        } catch (error) {
            console.error("Error creating chunks:", error);
            return null;
        }
    }

    /* * * * * * * * * * * * * */
    /* Get Embedding
    /* * * * * * * * * * * * * */
    async function getEmbedding(chunk: string, title: string, index: number) {
        try {
            const embeddingResponse = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: chunk,
            });
            const embedding = embeddingResponse.data.data[0].embedding;
            return {
                content: chunk,
                title: `${title}-${index}`,
                embedding: embedding,
            };
        } catch (error) {
            console.error("Error getting embedding:", error);
            return null;
        }
    }


    /* * * * * * * * * * * * * */
    /* Add Sources
    /* * * * * * * * * * * * * */
    try {
        const data = await req.json();
        const sources = data.data;
        const dataType = data.dataType;

        let newSource = null as any;

        const db = await getMongoDB() as any;
        const sourcesCollection = db.collection("sources");

        if (dataType === 'raw') {
            const processedSources = await Promise.all(sources.map(async (source: any) => {
                const sourcePayload = {} as any;

                const text = source.text;
                const name = source.name;
                const chunks = createChunks(text) as any;
                const embeddings = await Promise.all(chunks.map((chunk: any, index: number) => getEmbedding(chunk, name, index)));

                sourcePayload.name = name;
                sourcePayload.title = name;
                sourcePayload.type = 'raw';
                sourcePayload.text = text;
                sourcePayload.embeddings = embeddings;
                sourcePayload.category = 'general';

                /* * * * * * * * * * * * * */
                /* Add to MongoDB
                /* * * * * * * * * * * * * */
                const newSourceawait = await sourcesCollection.updateOne(
                    { name: name, type: 'raw' }, // Filter
                    { $set: sourcePayload },     // Update
                    { upsert: true }             // Options: if no match is found, create a new document
                );

                /* * * * * * * * * * * * * */
                /* Return new source
                /* * * * * * * * * * * * * */
                const returnSource = await sourcesCollection.findOne({ _id: name, type: 'raw' });
                return returnSource;
            }));


        } else if (dataType === 'file') {
            const processedSources = await Promise.all(sources.map(async (source: any) => {
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

                const chunks = createChunks(content) as any;
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
                const newSourceawait = await sourcesCollection.updateOne(
                    { name: name, type: 'file' }, // Filter
                    { $set: sourcePayload },     // Update
                    { upsert: true }             // Options: if no match is found, create a new document
                );

                /* * * * * * * * * * * * * */
                /* Return new source
                /* * * * * * * * * * * * * */
                const returnSource = await sourcesCollection.findOne({ name: name, type: 'file' });
                return returnSource;
            }));
        } else if (dataType === 'url') {
            const processedSources = await Promise.all(sources.map(async (source: any) => {

                // ###
                // ### Get the data
                // console.log(selector)
                // const name = url;
                // const title = $('title').text();
                // const text = $(selector).text();
                // console.log(text)

                // const chunks = createChunks(text) as any;
                // const embeddings = await Promise.all(chunks.map((chunk: any, index: any) => getEmbedding(chunk, title, index)));

                // // ###
                // // ### Create the payload
                // sourcePayload.name = name;
                // sourcePayload.title = title;
                // sourcePayload.type = 'url';
                // sourcePayload.text = text;
                // sourcePayload.embeddings = embeddings;
                // sourcePayload.category = 'general';

                // /* * * * * * * * * * * * * */
                // /* Add to MongoDB
                // /* * * * * * * * * * * * * */
                // newSource = await sourcesCollection.updateOne(
                //     { name: sourcePayload.name, type: sourcePayload.type }, // Filter
                //     { $set: sourcePayload },     // Update
                //     { upsert: true }             // Options: if no match is found, create a new document
                // );

                // /* * * * * * * * * * * * * */
                // /* Return new source
                // /* * * * * * * * * * * * * */
                // const returnSource = await sourcesCollection.findOne({ name: name, type: 'url' });
                // return returnSource;
                return;
            }));

        } else if (dataType === 'update') {

            console.log('updating')

            /* * * * * * * * * * * * * */
            /* Try to find the document
            /* * * * * * * * * * * * * */
            const source = sources[0];
            const docId = new ObjectId(source._id);

            const sourceDocument = await sourcesCollection.findOne({ _id: docId });
            if (!sourceDocument) throw new Error('source not found');
            const sourcePayload = {} as any;

            const title = source.title !== sourceDocument.title ? source.title : null;
            const text = source.text !== sourceDocument.text ? source.text : null;

            let chunks, embeddings;
            console.log('building chunks...')

            if (!!text && text !== sourceDocument.text) {
                chunks = createChunks(text) || [];
                embeddings = await Promise.all(chunks.map((chunk, index) => getEmbedding(chunk, title, index)));
            } else {
                chunks = null;
                embeddings = null;
            }

            console.log('chunks built')
            if (!!title) sourcePayload.title = title;
            if (!!text) sourcePayload.text = text;
            if (!!embeddings) sourcePayload.embeddings = embeddings;
            if (!!chunks) sourcePayload.chunks = chunks;

            // Search for an existing document with the same "name" and "type"
            newSource = await sourcesCollection.updateOne(
                { _id: docId },
                { $set: sourcePayload },
                { upsert: true }
            );

            /* * * * * * * * * * * * * */
            /* Return new source
            /* * * * * * * * * * * * * */
            const returnSource = await sourcesCollection.findOne({ _id: docId });
            return returnSource;

        }

        return NextResponse.json({ "source": newSource, success: true });

    } catch (error) {
        return NextResponse.json({ message: error, success: false });
    }
};
