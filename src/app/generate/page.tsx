import { fetchThreads, fetchTones, fetchFormulas, fetchSources, fetchMetaData, saveThread, getTitle, updateThread } from "./_actions";
import Generator from "./_components/Generator";

// export const runtime = 'edge'

export default async function Page() {
    const threads = await fetchThreads();
    const tones = await fetchTones();
    const formulas = await fetchFormulas();
    const sources = await fetchSources();

    return <Generator
        threadsData={threads || []}
        tonesData={tones || []}
        formulasData={formulas || []}
        sources={sources || []}
        fetchMetaData={fetchMetaData}
        saveThread={saveThread}
        getTitle={getTitle}
        updateThread={updateThread}
    />
} 