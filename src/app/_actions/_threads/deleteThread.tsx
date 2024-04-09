"use server"
import { getMongoDB } from '@/utils/getMongo'
import { ObjectId } from 'mongodb';

/**
 * Deletes a thread from the database.
 * @param data - The data object containing the thread ID.
 * @returns An object indicating the success of the operation and the updated list of threads.
*/
export async function deleteThread(data: any) {
    "use server"
    const db = await getMongoDB() as any;
    try {
        const threadToDelete = await db.collection('threads').deleteOne({ _id: new ObjectId(data._id) });
        const threads = await db.collection('threads').find({}).sort({ created: -1 }).toArray();
        const cleanThreads = threads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest })) as any;
        return {
            'success': true,
            'data': cleanThreads,
        };
    } catch (error) {
        return {
            'success': false,
            'error': error,
        };
    }
}