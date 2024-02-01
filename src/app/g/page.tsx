'use server';
import { fetchFormulas } from "@/app/_actions/_formulas/fetchFormulas";
import { fetchSources } from "@/app/_actions/_sources/fetchSources";
import { deleteThread } from "@/app/_actions/_threads/deleteThread";
import { fetchMetaData } from "@/app/_actions/_threads/fetchMetaData";
import { fetchThreads } from "@/app/_actions/_threads/fetchThreads";
import { getTitle } from "@/app/_actions/_threads/getTitle";
import { saveThread } from "@/app/_actions/_threads/saveThread";
import { updateThread } from "@/app/_actions/_threads/updatethread";
import { fetchTones } from "@/app/_actions/_tones/fetchTones";
import Generator from "@/app/g/_components/Generator";

/**
 * Renders the Page component.
 * Fetches threads, tones, formulas, and sources asynchronously.
 * Passes the fetched data and other functions as props to the Generator component.
 * @returns The rendered Generator component.
 */
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
        deleteThread={deleteThread}
    />
}
