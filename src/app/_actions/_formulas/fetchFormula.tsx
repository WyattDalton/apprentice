"use server"

import { getMongoDB } from "@/utils/getMongo";
import { ObjectId } from "mongodb";

export default async function fetchFormula(data: any) {
    'use server'
    const db = await getMongoDB() as any;
    try {

        let formulaData: any = {};
        try {
            const id = new ObjectId(data._id);
            const db = await getMongoDB() as any;
            const formula = await db.collection("formulas").findOne({ _id: id });

            formulaData = {
                _id: data._id,
                title: formula.title || '',
                instructions: formula.instructions || '',
                outline: formula.outline || '',
                thinkAbout: formula.thinkAbout || '',
            }

        } catch (error) {
            console.log(error);
        }

        return {
            'success': true,
            'formula': formulaData,
        };
    } catch (error) {
        return {
            'success': false
        };
    }
}