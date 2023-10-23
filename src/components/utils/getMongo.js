import { getUserData } from '@/components/utils/getUserData';
import clientPromise from './getMongoClient';

export const getMongoDB = async (id, org) => {
	try {
		const client = await clientPromise;
		let rawUserData;

		if (!id && !org) {
			rawUserData = await getUserData();
		} else {
			rawUserData = {
				userId: id,
				organization: org,
			};
		}

		console.log('RAW USER: ', rawUserData, '\n\n\n###\n\n\n');
		const userId = rawUserData.id.toString().toLowerCase().replace(/ /g, '_');

		const userOrganization = rawUserData.organization
			.toLowerCase()
			.replace(/ /g, '_');
		
		const _mongoUserId = `${userId}-${userOrganization}`;

		const db = client.db(_mongoUserId);

		return db;
	} catch (error) {
		console.log(error);
	}
};

export const closeMongoDB = async () => {
	await client.close();
};


