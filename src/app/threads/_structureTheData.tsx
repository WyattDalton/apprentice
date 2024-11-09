"use server"
/**
 * Structure the data by cleaning and transforming it into a specific format.
 * @param data - The data to be structured.
 * @returns An object containing headers and the structured data body.
 */
export default async function structureTheData(data: any) {
    "use server"

    const bodyData = data.map((thread: any) => {
        const payload = {} as any;

        payload['_id'] = !!thread.id ? thread.id : false;
        payload['id'] = !!thread.id ? thread.id.slice(-5).toUpperCase() : false;
        payload['created'] = !!thread.created ? new Date(thread.created).toLocaleDateString() : false;
        payload['title'] = !!thread.title ? thread.title : false;

        const meta = !!thread.meta ? thread.meta : false;
        if (!!meta) {
            payload['tags'] = !!meta.tags ? meta.tags : false;
        }
        return payload;
    });

    const headersData = [] as any;
    bodyData.map((item: any) => {
        Object.keys(item).forEach((key) => {
            if (key !== '_id') {
                if (!headersData.includes(key)) {
                    headersData.push(key);
                }
            }
        })
    });

    const payload = {
        headers: headersData,
        body: bodyData
    }

    return payload;
}
