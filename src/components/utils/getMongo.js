import { getUserData } from '@/components/utils/getUserData';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL);

export const getMongoDB = async () => {
	// Get User Data
	const rawUserData = getUserData();
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

export const closeMongoDB = async () => {
	await client.close();
};
