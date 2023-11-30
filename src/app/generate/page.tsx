
import { getAuth } from "../_actions";
import { getDataFromAPI } from "./_actions";
import Generator from "./_components/Generator";
import GeneratorDashboard from "./_components/GeneratorDashboard";
export const runtime = 'edge'

export default async function Page() {

    // When fired from here, the mongo db does not connect. It seems t be firing before a call to get the user auth is sent. So I need to find a way to cache the user auth and then use it here.
    const authData = await getAuth();
    const data = await getDataFromAPI(false);

    return <Generator threadsData={data?.threads || []} tonesData={data?.tones || []} formulasData={data?.formulas || []} sources={data?.sources || []} metaData={data?.meta || []} />
} 