import { getUserData } from '@/components/utils/getUserData';
import clientPromise from './getMongoClient';

export const getMongoDB = async (id, org, username) => {
	try {

		const client = await clientPromise;
		let rawUserData = await getUserData();

		if (!!id && !!org && !!username) {
			rawUserData = {
				id: id,
				organization: org,
				username: username,
			};
		}

		const userId = rawUserData.id.toString().toLowerCase().replace(/ /g, '_');

		const userOrganization = rawUserData.organization
			.toLowerCase()
			.replace(/ /g, '_');

		const userUsername = rawUserData.username.toLowerCase().replace(/ /g, '_');

		const _mongoUserId = `${userId}-${userUsername}-${userOrganization}`;

		const db = client.db(_mongoUserId);

		return db;
	} catch (error) {
		console.log('Error getting mongo: ', error);
	}
};

export const closeMongoDB = async () => {
	await client.close();
};


