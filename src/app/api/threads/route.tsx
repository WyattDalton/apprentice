import { Configuration, OpenAIApi } from 'openai-edge'
import { NextRequest, NextResponse } from 'next/server';
import { getMongoDB } from '@/utils/getMongo';
import { ObjectId } from 'mongodb';

const apiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!
})
const openai = new OpenAIApi(apiConfig)


export async function POST(req: NextRequest) {
    try {

        const db = await getMongoDB() as any;
        const body = await req.json();
        const { dataType, data } = body;
        const collection = db.collection("threads");

        if (dataType === 'create') {

            // get the mongodb _id for the new item after creating it
            const res = await collection.insertOne(data);
            return NextResponse.json({
                'success': true,
                'thread': res.insertedId,
            });

        } else if (dataType === 'update') {

            const { _id, update } = data;
            const res = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: update }, { upsert: true });
            const threads = await collection.find({}).toArray();
            return NextResponse.json({
                'success': true,
                'thread': res,
                'threads': threads,
            });

        } else if (dataType === 'delete') {

            const { _id } = data;
            const deleteThread = await collection.deleteOne({ _id: new ObjectId(_id) });
            const threads = await collection.find({}).sort({ created: -1 }).toArray();
            return NextResponse.json({
                'success': true,
                'threads': threads,
            });

        } else if (dataType === 'get') {

            const { _id } = data;
            if (!!_id) {
                const res = await collection.findOne({ _id: new ObjectId(_id) });
                return NextResponse.json({
                    'success': true,
                    'thread': res,
                });
            } else {
                const res = await collection.find().sort({ created: -1 }).toArray();

                return NextResponse.json({
                    'success': true,
                    'threads': res,
                });
            }

        } else if (dataType === 'getTitle') {
            const { messages, _id } = data;

            const cleanedMessages = messages.map(({ createdAt, id, settings, ...rest }: any) => rest);

            const instructions = 'Create a descriptive title for this thread that summarizes the previous messages. Limit the response to less than 100 characters. It should be as short as possible while also being descriptive enough to be useful. IMPORTANT: Your response should only include text. No special characters, and no numbers.';
            const instructionMessage = {
                'role': 'user',
                'content': instructions,
            }
            // Add instructionMessage to the end of the messages array
            cleanedMessages.push(instructionMessage);

            const res = await openai.createChatCompletion({
                model: 'gpt-4-turbo-preview',
                messages: cleanedMessages
            })

            const resData = await res.json();

            const title = resData.choices[0].message.content;

            // Upsert the title to this thread in mongo
            const update = { $set: { title } };
            const id = new ObjectId(_id);
            await collection.updateOne({ _id: id }, update, { upsert: true });
            const updatedThread = await collection.findOne({ _id: id });

            return NextResponse.json({
                'success': true,
                'title': title,
            });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'success': false,
            'message': error,
        });
    }
}
