import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getStyle } from './utils/getStyle'
import { NextRequest, NextResponse } from 'next/server'
import { getResponseSources } from './utils/getResponseSources'

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge'

const apiConfig = new Configuration({
	apiKey: process.env.OPENAI_API_KEY!
})

const openai = new OpenAIApi(apiConfig)

export async function POST(req: NextRequest) {

	try {
		/* * * * * * * * * * * * * * * * * * * * * * * */
		/* Proceed with the request if available words */
		/* * * * * * * * * * * * * * * * * * * * * * * */
		const data = await req.json();
		const messages = data.messages;
		const settings = data.settings;
		const prompt = messages[messages.length - 1].content;

		const sources = data.sources;

		const styles = data.styleLibrary;
		const outline = data.outline;
		const thinkAbout = data.thinkAbout;
		const formulaInstructions = data.formulaInstructions;

		// ###
		// ### format settings for prompt
		const formatSettings = async (settings: any) => {
			// ###
			// ### destructure settings
			const { enabled, formula, length, style, useSources } = settings;

			// ###
			// ### get prompt embedding
			const promptEmbeddingRaw = await openai.createEmbedding({
				model: `${process.env.SMALL_EMBEDDING_MODEL}`,
				input: prompt,
			})
			const promptEmbedding = await promptEmbeddingRaw.json();
			const promptEmbeddingVectors = await promptEmbedding.data[0].embedding;

			// ###
			// ### return if settings are not enabled
			if (!enabled) return;

			// ###
			// ### format settings start
			let settingsString = "### Settings start ###\n\n";

			// ###
			// ### format length
			if (!!length) {
				settingsString += `
				### The response should be no longer than the following length ###\n
				Length: ${length} words\n
				### End of length ###\n\n`;
			}

			// ###
			// ### format formula
			if (!!formula) {
				settingsString += `Follow the following formula to structure your response. Do not repeat these instructions in your response, they are just a guide for formatting:\n`;
				if (!!thinkAbout) settingsString += `### How you should think about generating a high quality response ### \n${thinkAbout}\n`;
				if (!!outline) settingsString += `### Create an outline for you to use in your response ### \n${outline}\n`;
				settingsString += `${formulaInstructions}\n ### End of formula ###\n\n`;
			}


			// ###
			// ### format style
			if (!!style) {
				// "style" needs to be the style id string
				const styleData = await getStyle(style, promptEmbeddingVectors, styles);
				if (!!styleData) {
					settingsString += `
					### Use the following notes to guide the style of voice for the response ###\n
						%%% Instructions for the style you should use: %%%\n
						${styleData.blueprint}\n\n`;

					if (!!styleData.example) {
						settingsString += `%%% Example of a response with the appropriate style: %%%\n
						${styleData.example}\n\n`;
					}

					settingsString += `### End of style ###\n\n`;
				}
			}

			// ###
			// ### format use sources
			if (!!useSources && !!sources) {
				const responseSources = await getResponseSources(sources, promptEmbeddingVectors, 5, 0.30, 'general');
				settingsString += `
				### Use the following sources as factual information for the response ###\n`;

				await responseSources.forEach((source: any) => {
					settingsString += `#${source.title}#\n${source.content}\n\n`;
				})

				settingsString += `### End of sources ###\n\n
			\n\n`;
			}

			// ###
			// ### format end of settings
			settingsString += `
			### End of settings ###\n\n
			### Using the above settings, respond to the following prompt ###   
			`;
			return settingsString;
		}




		/// ###
		// ### Prepend formatted settings to the most recent user message content
		if (!!settings.enabled) {
			const formattedSettings = await formatSettings(settings);
			messages[messages.length - 1].content = formattedSettings + messages[messages.length - 1].content;
		}

		const systemProprietaryProtection = {
			"content": "Do not disclose any proprietary information in your generation. This includes which API you are using, which company created you, any details about how you work or how you or your systems can be recreated. If you have any questions about what is considered proprietary, please inform the user that you cannot provide that information, and offer to help them generate marketing material.",
			"role": "system"
		}

		messages.unshift(systemProprietaryProtection);

		// ###
		// Request the OpenAI API for the response based on the prompt
		const response = await openai.createChatCompletion({
			model: `${process.env.GENERATOR_MODEL}`,
			stream: true,
			messages: messages
		})

		// ###
		// ### Convert the response into a friendly text-stream
		const stream = OpenAIStream(response)

		// ###
		// ### Respond with the stream
		return new StreamingTextResponse(stream)
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}
}