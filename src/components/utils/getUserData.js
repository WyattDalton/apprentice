export function getUserData() {
	const rawUserData = {
		userId: 1, // userId is used to create MongoDB collection
		name: 'Wyatt Development',
		username: 'wyattdev',
		email: 'w.dev@website.com',
		organization: 'Maker Digital',
	};
	return rawUserData;
}
