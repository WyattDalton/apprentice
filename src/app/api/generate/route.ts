import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getResponseSources } from './utils/getResponseSources'
import { getTone } from './utils/getTone'
import { templatize } from './utils/getFormula'
import { NextRequest, NextResponse } from 'next/server'
import { getMongoDB } from '@/utils/getMongo'
import { getUserData } from '@/components/utils/getUserData'


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
		const tones = data.toneLibrary;
		const formulas = data.formulaLibrary;

		let responseSources: any = [];

		// ###
		// ### format settings for prompt
		const formatSettings = async (settings: any) => {
			// ###
			// ### destructure settings
			const { enabled, details, contentType, formula, intention, length, tone, useSources } = settings;

			// ###
			// ### get prompt embedding
			const promptEmbeddingRaw = await openai.createEmbedding({
				model: "text-embedding-3-small",
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
			// ### format details
			if (!!details) {
				settingsString += `
				### Include the below details in the response ###\n
				Details: ${details}\n
				### End of details ###\n\n`;
			}

			// ###
			// ### format content type
			if (!!contentType) {
				settingsString += `
				### Format your response as the following content type ###\n
				Format your response to be useful as a: ${contentType}\n
				### End of content type ###\n\n`;
			}

			// ###
			// ### format intention
			if (!!intention) {
				settingsString += `
				### The intention of the response the following ###\n
				This is the intended use of the response you'll generate: ${intention}\n
				### End of intention ###\n\n`;
			}

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
				const f = await templatize(formula, formulas)
				settingsString += `
				Follow the followingt formula to structure your response. Do not repeat these instructions in your response, they are just a guide for formatting:\n

				 ${f.templatizedMessage}\n
				
				### End of formula ###\n\n`;
			}


			// ###
			// ### format tone
			if (!!tone) {
				// "tone" needs to be the tone id string
				const toneData = await getTone(tone, promptEmbeddingVectors, tones);
				if (!!toneData) {
					settingsString += `
					### Use the following notes to guide the tone of voice for the response ###\n
						%%% Instructions for the tone you should use: %%%\n
						${toneData.instructions}\n\n`;

					if (!!toneData.example) {
						settingsString += `%%% Example of a response with the appropriate tone: %%%\n
						${toneData.example}\n\n`;
					}

					settingsString += `### End of tone ###\n\n`;
				}
			}

			// ###
			// ### format use sources
			if (!!useSources) {
				responseSources = await getResponseSources(sources, promptEmbeddingVectors, 10, 0.70, 'general');

				settingsString += `
				### Use the following sources as factual information for the response ###\n`;

				await responseSources.forEach((source: any) => {
					settingsString += `#${source.title}#\n${source.content}\n\n`;
				})

				settingsString += `### End of sources ###\n\n
				### If there are no sources, start your response with a variation of the following ###\n
				WARNING: I do not have enough information to respond to your request factually. I will do my best to respond, but you may need to edit my response for accuracy.\n
				### End of warning ###\n\n`;
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

		// Request the OpenAI API for the response based on the prompt
		const response = await openai.createChatCompletion({
			model: 'gpt-4-turbo-preview',
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