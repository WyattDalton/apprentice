import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

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

		const prompt = data.prompt;

		// Request the OpenAI API for the response based on the prompt
		const response = await openai.createChatCompletion({
			model: `${process.env.PROCESSING_MODEL}`,
			stream: true,
			messages: [
				{
					'role': 'system',
					'content': 'You are a very good at reasoning out the steps it would take to respond to completely and skillfully create a high-quality response based on a prompt by the user.'
				},
				{
					'role': 'user',
					'content': prompt
				}
			]
		})

		// ###
		// ### Convert the response into a friendly text-stream
		const stream = OpenAIStream(response)

		// ###
		// ### Respond with the stream
		const responseStream = new StreamingTextResponse(stream)

		return responseStream;
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}
}