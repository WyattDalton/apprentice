import { getUserData } from '@/components/utils/getUserData';
import clientPromise from './getMongoClient';

export const getMongoDB = async (id, username) => {
	try {
		const client = await clientPromise;
		let rawUserData = await getUserData();

		if (!!id && !!username) {
			rawUserData = {
				id: id,
				username: username,
			};
		}

		const userId = rawUserData.id
			.toString()
			.toLowerCase()
			.replace(/ /g, '__')
			.replace(/[^a-zA-Z0-9]/g, '_');

		const userUsername = rawUserData.username
			.toLowerCase()
			.replace(/ /g, '__')
			.replace(/[^a-zA-Z0-9]/g, '_');

		const _mongoUserId = `${userId}-${userUsername}`;

		const db = client.db(_mongoUserId);

		return db;
	} catch (error) {
		console.log('Error getting mongo: ', error);
	}
};


