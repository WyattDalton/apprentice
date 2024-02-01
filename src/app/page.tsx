import { fetchFormulas } from "./_actions/_formulas/fetchFormulas";
import { fetchSources } from "./_actions/_sources/fetchSources";
import { deleteThread } from "./_actions/_threads/deleteThread";
import { fetchMetaData } from "./_actions/_threads/fetchMetaData";
import { fetchThreads } from "./_actions/_threads/fetchThreads";
import { getTitle } from "./_actions/_threads/getTitle";
import { saveThread } from "./_actions/_threads/saveThread";
import { updateThread } from "./_actions/_threads/updatethread";
import { fetchTones } from "./_actions/_tones/fetchTones";
import Generator from "./g/_components/Generator";

/**
 * Renders the Page component.
 * 
 * @returns The Generator component with data fetched from various sources.
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
