
import { getDataFromAPI } from "./_actions";
import Generator from "./_components/Generator";
import GeneratorDashboard from "./_components/GeneratorDashboard";
export const runtime = 'edge'

export default async function Page() {

    const data = await getDataFromAPI(false);

    return <Generator threadsData={data.threads} tonesData={data.tones} formulasData={data.formulas} sources={data.sources} metaData={data.meta} />
} 