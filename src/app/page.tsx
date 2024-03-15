'use server';
// Import the necessary functions from _actions.
import { fetchFormulas } from "@/app/_actions/_formulas/fetchFormulas";
import { fetchSources } from "@/app/_actions/_sources/fetchSources";
import { deleteThread } from "@/app/_actions/_threads/deleteThread";
import { fetchThreads } from "@/app/_actions/_threads/fetchThreads";
import { getTitle } from "@/app/_actions/_threads/getTitle";
import { saveThread } from "@/app/_actions/_threads/saveThread";
import { updateThread } from "@/app/_actions/_threads/updatethread";
import { fetchStyles } from "@/app/_actions/_styles/fetchStyles";
import { retrieveSources } from "@/app/_actions/_generator/retrieveSources";
import { retrievePromptEmbedding } from "@/app/_actions/_generator/retrievePromptEmbedding";

// Import the Generator component.
import Generator from "@/app/g/_components/Generator";

/**
 * Renders the Page component.
 * Fetches threads, styles, formulas, and sources asynchronously.
 * Passes the fetched data and other functions as props to the Generator component.
 * @returns The rendered Generator component.
 */
export default async function Page() {

  const threads = await fetchThreads();
  const styles = await fetchStyles();
  const formulas = await fetchFormulas();
  const sources = await fetchSources();

  return <Generator
    threadsData={threads || []}
    stylesData={styles || []}
    formulasData={formulas || []}
    sources={sources || []}
    saveThread={saveThread}
    getTitle={getTitle}
    updateThread={updateThread}
    deleteThread={deleteThread}
    retrieveSources={retrieveSources}
    retrievePromptEmbedding={retrievePromptEmbedding}
  />
}
