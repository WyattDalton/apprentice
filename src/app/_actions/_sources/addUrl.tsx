"use server"

import { getMongoDB } from "@/utils/getMongo";
import { createChunks, getEmbedding } from "./utilities";
const cheerio = require('cheerio');


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
