"use server";

// import { getMongoDB } from "@/components/utils/getMongo";
// import { ObjectId } from "mongodb";

// export async function fetchTones() {
//     const db = await getMongoDB() as any;
//     const tones = db.collection("tones");
//     const allTones = await tones.find({}).toArray();
//     return allTones;
// }

// export async function fetchFormulas() {
//     const db = await getMongoDB() as any;
//     const formulas = db.collection("formulas");
//     const allFormulas = await formulas.find({}).toArray();
//     return allFormulas;
// }

// export async function fetchThreads() {
//     const db = await getMongoDB() as any;
//     const threads = db.collection("threads");
//     const allThreads = await threads.find({}).toArray();
//     return allThreads;
// }

// export async function fetchMetadata(threadId: string) {
//     const db = await getMongoDB() as any;
//     const threads = db.collection("threads");
//     const _id = new ObjectId(threadId);
//     const thread = await threads.findOne({ _id: _id });

//     const threadMeta = {} as any;
//     thread.title ? threadMeta['title'] = thread.title : null;
//     if (!threadMeta) return null;
//     return threadMeta;
// }

export async function getDataFromAPI(generation: any) {
    try {
        const api_url = process.env.API_URL;
        const endpoint = `${api_url}/data`;
        const payload = {} as any;
        payload['dataFor'] = 'generator';
        !!generation ? payload['thread'] = generation : payload['thread'] = false;

        console.log('Start server action fetch')
        console.log("endpoint: ", endpoint);
        console.log("payload: ", payload);

        const data = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload),
            cache: 'no-store',
        }) as any;

        const res = await data.json();

        console.log('End server action fetch: ', res.success, ' check: ', !!res.success);

        if (!!res.success) {
            console.log('server action fetch success');
            console.log('From server action:  RAW RES - ', res.success)

            const d = res.data;

            const dataResponse = {} as any;

            !!d.sources ? dataResponse['sources'] = d.sources : dataResponse['sources'] = false;
            !!d.tones ? dataResponse['tones'] = d.tones : dataResponse['tones'] = false;
            !!d.formulas ? dataResponse['formulas'] = d.formulas : dataResponse['formulas'] = false;
            !!d.threads ? dataResponse['threads'] = d.threads : dataResponse['threads'] = false;
            !!d.user ? dataResponse['user'] = d.user : dataResponse['user'] = false;
            !!d.meta ? dataResponse['meta'] = d.meta : dataResponse['meta'] = false;

            console.log('From server action ', !!dataResponse.sources, !!dataResponse.tones, !!dataResponse.formulas, !!dataResponse.threads, !!dataResponse.user, !!dataResponse.meta)

            return dataResponse
        } else {
            console.log('server action fetch failed');
            new Error('Server action fetch failed');
            return null
        }

    } catch (error) {
        console.log(error);
    }
}