import { getAuth } from '@/app/_actions';

export async function getUserData() {
	const rawUserData = await getAuth();
	const user = rawUserData.user;
	return user;
}
