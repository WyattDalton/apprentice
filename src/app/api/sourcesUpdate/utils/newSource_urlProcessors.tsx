'user sever'

const cheerio = require('cheerio');

/**
 * Fetches HTML content from a given URL.
 * @param src - The URL to fetch HTML from.
 * @returns A promise that resolves to the fetched HTML content.
 */
export async function fetchHtmlFromUrl(src: any) {
    'use server'
    const url = src;
    const res = await fetch(url);
    const html = await res.text();
    return html;
}


/**
 * Processes the HTML content obtained from a URL.
 * 
 * @param html - The HTML content to process.
 * @returns An object containing the success status and the processed content.
 */
export async function processHtmlFromUrl(html: any) {
    'use server'

    // ###
    // ### Fetch the url, load the HTML, and parse it with Cheerio. change "rawContent" if no error.
    try {
        const $ = cheerio.load(html);

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


        // # Get body text
        return {
            "success": false,
            "content": $('body').text(),
        };

    } catch (err: any) {
        console.log("Error scraping url: ", err.message);
        return {
            "success": false,
            "content": "",
        };
    }
}