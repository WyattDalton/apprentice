import Generator from "./_components/Generator";
import GeneratorDashboard from "./_components/GeneratorDashboard";

export const runtime = 'edge'

const getDataFromAPI = async (generation: any) => {
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

export default async function Page() {

    // When fired from here, the mongo db does not connect. It seems t be firing before a call to get the user auth is sent. So I need to find a way to cache the user auth and then use it here.
    const data = await getDataFromAPI(false);

    return <Generator threadsData={data?.threads || []} tonesData={data?.tones || []} formulasData={data?.formulas || []} sources={data?.sources || []} metaData={data?.meta || []} />
} 