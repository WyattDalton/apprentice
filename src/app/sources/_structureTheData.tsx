"use server"
/**
 * Structure the data by cleaning and transforming it into a specific format.
 * @param data - The data to be structured.
 * @returns An object containing headers and the structured data body.
 */
export default async function structureTheData(data: any) {
    "use server"

    const bodyData = data.map((source: any) => {
        const payload = {} as any;
        payload['_id'] = !!source._id ? source._id : false;
        payload['id'] = !!source._id ? source._id.slice(-5).toUpperCase() : false;
        payload['title'] = !!source.title ? source.title : false;
        payload['type'] = !!source.type ? source.type : false;
        return payload;
    });

    const headerData = [
        "id",
        "title",
        "type"
    ] as any;

    const payload = {
        headers: headerData,
        body: bodyData
    }

    return payload;
}
