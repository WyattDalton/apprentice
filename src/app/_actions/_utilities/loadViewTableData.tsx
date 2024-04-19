"use server"

import structureTheData from "@/app/formulas/_structureTheData";
import { fetchStyles } from "../_styles/fetchStyles";
import { fetchFormulas } from "../_formulas/fetchFormulas";
import { fetchSources } from "../_sources/fetchSources";
import { fetchThreads } from "../_threads/fetchThreads";

export default async function loadData(dataSource: string) {
    "use server"
    let rawData = null as any;
    switch (dataSource) {
        case "styles":
            rawData = await fetchStyles();
            break;
        case "formulas":
            rawData = await fetchFormulas();
            break;
        case "sources":
            rawData = await fetchSources();
            break;
        case "threads":
            rawData = await fetchThreads();
            break;
        default:
            throw new Error("Invalid data source");
    }
    const tableData = await structureTheData(rawData);
    return tableData;
}