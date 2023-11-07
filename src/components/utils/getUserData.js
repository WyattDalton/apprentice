import { getAuth } from '@/app/_actions';

export async function getUserData() {
	const rawUserData = await getAuth();
	console.log('rawUserData from auth: ', rawUserData);
	const user = rawUserData.user;
	return user;
}
