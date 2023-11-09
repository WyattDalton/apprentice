import { NextResponse } from 'next/server';
import { getMongoDB } from '@/components/utils/getMongo';

export async function getAllSources() {
    try {
        const db = await getMongoDB() as any;
        const sources = await db.collection("sources").find({}).toArray();
        const cleanSources = sources.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return cleanSources;
    } catch (error) {
        console.log(error)
    }
}

export async function GET(req: Request) {
    try {

        const db = await getMongoDB() as any;
        const sources = await db.collection("sources").find({}).toArray();

        return NextResponse.json({ 'sources': sources, 'success': true });

    } catch (error) {
        return NextResponse.json({ 'message': error, 'success': false });
    }
};
