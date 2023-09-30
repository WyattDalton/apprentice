export async function getUserData() {
	const rawUserData = await fetch(
		'https://makerdigital.io/wp-json/wp/v2/makerdigital/v1/get-user-data'
	);

	if (!rawUserData.ok) {
		console.error('Could not fetch user data');
		return false;
	}

	console.log('rawUserData', rawUserData);

	return await rawUserData.json();
}
