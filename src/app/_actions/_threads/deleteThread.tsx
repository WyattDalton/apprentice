"use server"
import { getMongoDB } from '@/utils/getMongo'
import { ObjectId } from 'mongodb';

/**
 * Deletes a thread from the database.
 * @param data - The data object containing the thread ID.
 * @returns An object indicating the success of the operation and the updated list of threads.
 */
export async function deleteThread(data: any) {
    try {
        const { _id } = data;
        const db = await getMongoDB('threads') as any;
        const collection = db.collection('threads');
        const deleteThread = await collection.deleteOne({ _id: new ObjectId(_id) });
        const threads = await collection.find({}).sort({ created: -1 }).toArray();

        const cleanThreads = threads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return {
            'success': true,
            'threads': cleanThreads,
        };
    } catch (error) {
        return {
            'success': false,
            'error': error,
        };
    }
}