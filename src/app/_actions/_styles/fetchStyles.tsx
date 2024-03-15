'use server';
import { getMongoDB } from "@/utils/getMongo";

/**
 * Fetches styles from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of styles.
 */
export async function fetchStyles() {
    'use server';
    try {
        const db = await getMongoDB() as any;
        const styles = db.collection("styles");
        const allStyles = await styles.find({}).toArray();
        const cleanStyles = allStyles.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
        return cleanStyles;
    } catch (err) {
        console.error("Error in fetchStyles: ", err);
    }
}