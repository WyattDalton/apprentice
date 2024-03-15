"use server"
import { getMongoDB } from '@/utils/getMongo';
import { ObjectId } from 'mongodb';
import OpenAI from "openai";
const openAIApi = new OpenAI({
	organization: "org-B0x5nwrSR31e5bkeQuwEKeyY",
	apiKey: process.env.OPENAI_API_KEY,
});

const mammoth = require("mammoth");
const pdfParse = require('pdf-parse');
const cheerio = require('cheerio');

/**
 * Splits a given text into chunks based on a specified chunk size and overlap size.
 * @param text - The text to be split into chunks.
 * @returns An array of chunks.
 */
async function createChunks(text: string) {
	"use server"
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
	"use server"
	try {
		const embeddingResponse = await openAIApi.embeddings.create({
			model: `${process.env.SMALL_EMBEDDING_MODEL}`,
			input: chunk,
		});
		const embedding = embeddingResponse.data[0].embedding;
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

export async function addRaw(sources: any) {
	"use server"
	const db = await getMongoDB() as any;
	const sourcesCollection = db.collection("sources");

	const processedSources = await Promise.all(sources.map(async (source: any) => {
		const sourcePayload = {} as any;

		const text = source.text;
		const name = source.name;
		const chunks = await createChunks(text) as any;
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
		const returnSource = await sourcesCollection.findOne({
			_id: newSourceawait.upsertedId,
			type: 'raw'
		},
			{
				projection: { category: 1, name: 1, text: 1, title: 1, type: 1, _id: 1 }
			});
		const cleanedSource = { ...returnSource, _id: returnSource._id.toString() };
		return { success: true, source: cleanedSource };
	}));
}


/**
 * Adds files to the MongoDB collection.
 * @param sources An array of sources to be added.
 * @returns A Promise that resolves to an array of newly added sources.
 */
export async function addFiles(source: any) {
	"use server"
	try {
		const db = await getMongoDB() as any;
		const sourcesCollection = db.collection("sources");

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
		const newSourceawait = await sourcesCollection.updateOne(
			{ name: name, type: 'file' }, // Filter
			{ $set: sourcePayload },     // Update
			{ upsert: true }             // Options: if no match is found, create a new document
		);

		/* * * * * * * * * * * * * */
		/* Return new source
		/* * * * * * * * * * * * * */
		const returnSource = await sourcesCollection.findOne({
			_id: newSourceawait.upsertedId,
			type: 'file'
		},
			{
				projection: { category: 1, name: 1, text: 1, title: 1, type: 1, _id: 1 }
			});
		const cleanedSource = { ...returnSource, _id: returnSource._id.toString() };
		return { success: true, source: cleanedSource };
	} catch (err) {
		return { success: false, message: err };
	}
}

/**
 * Fetches HTML content from a given URL.
 * @param src - The URL to fetch HTML from.
 * @returns A promise that resolves to the fetched HTML content.
 */
export async function fetchHtmlFromUrl(src: any) {
	"use server"
	try {
		const url = src;
		const res = await fetch(url);
		const html = await res.text();
		return { "success": true, "url": url, "content": html };
	} catch (err: any) {
		return { "success": false, "url": src, "content": {} };
	}
}


/**
 * Processes the HTML content obtained from a URL.
 * 
 * @param html - The HTML content to process.
 * @returns An object containing the success status and the processed content.
 */
export async function processHtmlFromUrl(obj: any) {
	"use server"

	// ###
	// ### Fetch the url, load the HTML, and parse it with Cheerio. change "rawContent" if no error.
	try {
		const $ = cheerio.load(obj.content);

		// ###
		// ### Get the title
		let title = $('h1:first').text();
		if (!title) {
			title = $('head title').text();
		}

		// ###
		// ### Clean the HTML of secondary content
		$('head').remove();
		$('style').remove();
		$('script').remove();
		$('noscript').remove();
		$('img').remove();
		$('iframe').remove();
		$('svg').remove();
		$('form').remove();
		$('input').remove();
		$('textarea').remove();
		$('button').remove();
		$('select').remove();
		$('option').remove();
		$('label').remove();
		$('nav').remove();
		$('footer').remove();
		$('header').remove();
		$('aside').remove();



		// ###
		// ### Remove common classes for header, navigation, footer, and sidebar areas
		$('[class*="header"]').remove();
		$('[class*="navigation"]').remove();
		$('[class*="footer"]').remove();
		$('[class*="sidebar"]').remove();
		$('[class*="side-bar"]').remove();
		$('[class*="side_bar"]').remove();
		$('[class*="nav"]').remove();
		$('[class*="menu"]').remove();
		$('[class*="footer"]').remove();
		$('[class*="foot"]').remove();



		// ###
		// ### Get the body text
		const rawText = $('body').text();
		const cleanedWhiteSpace = rawText.replace(/ {2,}/g, ' ');
		const text = cleanedWhiteSpace.replace(/\n{3,}/g, '\n\n');

		// # Get body text
		return {
			"success": true,
			"url": obj.url,
			"content": {
				"title": title,
				"text": text
			}
		};

	} catch (err: any) {
		return {
			"success": false,
			"url": obj.url,
			"content": {}
		};
	}
}

/**
 * Adds a URL to the MongoDB collection.
 * @param url The URL to be added.
 * @returns A Promise that resolves to the newly added source.
 */
export async function addUrl(obj: any) {
	"use server"

	try {
		// ###
		// ### Init variables
		const db = await getMongoDB() as any;
		const sourcesCollection = db.collection("sources");
		const sourcePayload = {} as any;

		// ###
		// ### Get the data
		const name = obj.url;
		const title = obj.content.title;
		const text = obj.content.text;

		const chunks = await createChunks(text) as any;
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
		const newSource = await sourcesCollection.updateOne(
			{ name: sourcePayload.name, type: sourcePayload.type }, // Filter
			{ $set: sourcePayload },     // Update
			{ upsert: true }             // Options: if no match is found, create a new document
		);

		/* * * * * * * * * * * * * */
		/* Return new source
		/* * * * * * * * * * * * * */
		const new_id = newSource.upsertedId;
		const returnSource = await sourcesCollection.findOne(
			{ _id: new_id }, {
			projection: { category: 1, name: 1, text: 1, title: 1, type: 1, _id: 1 },
		}
		);
		const cleanedSource = { ...returnSource, _id: returnSource._id.toString() };
		return { success: true, source: cleanedSource };
	} catch (err) {
		return {
			"err": err,
			"success": false
		}
	}
}

/**
 * Retrieves a source from the MongoDB collection.
 * @param id The ID of the source to be retrieved.
 * @returns A Promise that resolves to the retrieved source.
 */
export async function fetchSource(idString: string) {
	"use server"
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
	"use server"
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
	"use server"
	try {
		const _id = new ObjectId(id);
		const db = await getMongoDB() as any;

		// delete source by id
		const deleted = await db.collection("sources").deleteOne({ "_id": _id });
		const sources = await db.collection("sources").find({}).toArray();
		const cleanSources = sources.map(({ _id, embeddings, ...rest }: any) => {
			return { ...rest, _id: _id.toString() };
		});
		return { sources: cleanSources, success: true };
	} catch (err) {
		return { success: false, message: err };
	}
}

/**
 * Updates a source in the MongoDB collection.
 * @param id The ID of the source to be updated.
 * @param update The updated data for the source.
 * @returns A Promise that resolves to the updated source.
 */
export async function updateSource(id: any, update: any) {
	"use server"
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
			chunks = await createChunks(text) || [];
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
		const cleanSource = { ...returnSource, _id: returnSource._id.toString() };
		return { success: true, source: cleanSource };
	} catch (error) {
		return { success: false, message: error };
	}
}