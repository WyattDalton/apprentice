'use server';

import { getUserData } from '@/components/utils/getUserData';
import { MongoClient } from 'mongodb';

// ###
// ### Get mongo client
export const getMongoDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URL as string);

    // Get User Data
    const rawUserData = await getUserData();
    const userId = rawUserData.userId.toString().toLowerCase().replace(/ /g, '_');
    const userOrganization = rawUserData.organization
        .toLowerCase()
        .replace(/ /g, '_');
    const _mongoUserId = `${userId}-${userOrganization}`;

    // Get mongodb client
    await client.connect();
    const db = client.db(_mongoUserId);
    return db;
};