"use server"
/**
 * Structure the data by cleaning and transforming it into a specific format.
 * @param data - The data to be structured.
 * @returns An object containing headers and the structured data body.
 */
export default async function structureTheData(data: any) {
    "use server"

    const bodyData = data.map((style: any) => {
        const payload = {} as any;
        payload['_id'] = !!style.id ? style._id : false;
        payload['id'] = !!style.id ? style._id.slice(-5).toUpperCase() : false;
        payload['title'] = !!style.title ? style.title : false;
        payload['tags'] = !!style.tags ? style.tags : false;
        return payload;
    });

    const headerData = [
        "id",
        "title"
    ] as any;

    const payload = {
        headers: headerData,
        body: bodyData
    }

    return payload;
}
