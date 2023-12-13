import { getMongoDB } from '@/components/utils/getMongo';
import { Configuration, OpenAIApi } from "openai";
import { ObjectId } from 'mongodb';
const configuration = new Configuration({
	organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const mammoth = require("mammoth");
const pdfParse = require('pdf-parse');
const cheerio = require('cheerio');

/**
 * Splits a given text into chunks based on a specified chunk size and overlap size.
 * @param text - The text to be split into chunks.
 * @returns An array of chunks.
 */
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
		console.error('Error creating chunks:', error);
		return null;
	}
}


/**
 * Retrieves the embedding for a given chunk of text.
 * @param chunk - The text chunk to retrieve the embedding for.
 * @param title - The title associated with the chunk.
 * @param index - The index of the chunk.
 * @returns An object containing the content, title, and embedding of the chunk, or null if an error occurs.
 */
async function getEmbedding(chunk: string, title: string, index: number) {
	try {
		const embeddingResponse = await openai.createEmbedding({
			model: 'text-embedding-ada-002',
			input: chunk,
		});
		const embedding = embeddingResponse.data.data[0].embedding;
		return {
			content: chunk,
			title: `${title}-${index}`,
			embedding: embedding,
		};
	} catch (error) {
		console.error('Error getting embedding:', error);
		return null;
	}
}



/**
 * Adds files to the MongoDB collection.
 * @param sources An array of sources to be added.
 * @returns A Promise that resolves to an array of newly added sources.
 */
export async function addFiles(sources: any) {
	'use server'
	const db = await getMongoDB() as any;
	const sourcesCollection = db.collection("sources");

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
}

/**
 * Adds a URL to the MongoDB collection.
 * @param url The URL to be added.
 * @returns A Promise that resolves to the newly added source.
 */
export async function addUrl(url: string) {
	'use server'
	// ###
	// ### Initiate variables
	const db = await getMongoDB() as any;
	const sourcesCollection = db.collection("sources");
	let newSource;
	const sourcePayload = {} as any;

	// ###
	// ### Fetch the url
	const res = await fetch(url);
	const html = await res.text();
	const $ = cheerio.load(html);

	// ###
	// ### Get the data
	const name = url;
	const title = $('title').text();
	const text = $('body').text();

	const chunks = createChunks(text) as any;
	const embeddings = await Promise.all(chunks.map((chunk: any, index: any) => getEmbedding(chunk, title, index)));

	// ###
	// ### Create the payload
	sourcePayload.name = name;
	sourcePayload.title = title;
	sourcePayload.type = 'url';
	sourcePayload.text = text;
	sourcePayload.embeddings = embeddings;
	sourcePayload.category = 'general';

	/* * * * * * * * * * * * * */
	/* Add to MongoDB
	/* * * * * * * * * * * * * */
	newSource = await sourcesCollection.updateOne(

		{ name: sourcePayload.name, type: sourcePayload.type }, // Filter
		{ $set: sourcePayload },     // Update
		{ upsert: true }             // Options: if no match is found, create a new document
	);

	/* * * * * * * * * * * * * */
	/* Return new source
	/* * * * * * * * * * * * * */
	const returnSource = await sourcesCollection.findOne({ name: name, type: 'url' });
	return returnSource;
}

/**
 * Retrieves a source from the MongoDB collection.
 * @param id The ID of the source to be retrieved.
 * @returns A Promise that resolves to the retrieved source.
 */
export async function fetchSource(idString: string) {
	'use server'
	try {
		const id = new ObjectId(idString);
		const db = await getMongoDB() as any;
		const source = await db.collection("sources").findOne({ _id: id });
		if (source) {
			const cleanSource = {
				type: source.type,
				category: source.category,
				name: source.name,
				title: source.title,
				text: source.text,
				_id: source._id.toString()
			};
			return cleanSource;
		}
		throw new Error('Source not found');
	} catch (error) {
		return { success: false, message: error }
	}
};

/**
 * Retrieves all sources from the MongoDB collection.
 * @returns A Promise that resolves to an array of sources.
 */
export async function fetchSources() {
	'use server'
	const db = await getMongoDB() as any;
	const sources = await db.collection("sources").find({}).toArray();
	const cleanSources = sources.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
	return cleanSources;
}

/**
 * Deletes a source from the MongoDB collection.
 * @param id The ID of the source to be deleted.
 * @returns A Promise that resolves to a success message.
 */
export async function deleteSource(id: any) {
	'use server'
	const _id = new ObjectId(id);
	const db = await getMongoDB() as any;

	// delete source by id
	const deleted = await db.collection("sources").deleteOne({ "_id": _id });
	const sources = await db.collection("sources").find({}).toArray();
	const cleanSources = sources.map(({ _id, embeddings, ...rest }: any) => {
		return { ...rest, _id: _id.toString() };
	});
	return sources;
}

/**
 * Updates a source in the MongoDB collection.
 * @param id The ID of the source to be updated.
 * @param update The updated data for the source.
 * @returns A Promise that resolves to the updated source.
 */
export async function updateSource(id: any, update: any) {
	'use server'
	try {
		const db = await getMongoDB() as any;
		const sourcesCollection = db.collection("sources");
		let newSource;

		/* * * * * * * * * * * * * */
		/* Try to find the document
		/* * * * * * * * * * * * * */
		const source = update;
		const _id = new ObjectId(id);

		const sourceDocument = await sourcesCollection.findOne({ _id: _id });
		if (!sourceDocument) throw new Error('source not found');
		const sourcePayload = {} as any;

		const title = source.title !== sourceDocument.title ? source.title : null;
		const text = source.text !== sourceDocument.text ? source.text : null;

		let chunks, embeddings;

		if (!!text && text !== sourceDocument.text) {
			chunks = createChunks(text) || [];
			embeddings = await Promise.all(chunks.map((chunk, index) => getEmbedding(chunk, title, index)));
		} else {
			chunks = null;
			embeddings = null;
		}

		if (!!title) sourcePayload.title = title;
		if (!!text) sourcePayload.text = text;
		if (!!embeddings) sourcePayload.embeddings = embeddings;
		if (!!chunks) sourcePayload.chunks = chunks;

		// Search for an existing document with the same "name" and "type"
		newSource = await sourcesCollection.updateOne(
			{ _id: _id },
			{ $set: sourcePayload },
			{ upsert: true }
		);

		/* * * * * * * * * * * * * */
		/* Return new source
		/* * * * * * * * * * * * * */
		const returnSource = await sourcesCollection.findOne({ _id: _id });
		return { success: true };
	} catch (error) {
		return { success: false, message: error };
	}
}
