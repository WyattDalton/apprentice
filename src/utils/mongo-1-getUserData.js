import { getAuthFromWP } from './auth-2-getAuthFromWP';

export async function getUserData() {
	const rawUserData = await getAuthFromWP();
	const user = rawUserData.user;
	return user;
}
