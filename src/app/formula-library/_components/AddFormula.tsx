'use client'

import Card from "@/components/UI/Card";
import { type } from "os";

type Props = {
    handleAddFormula: any;
    type: string;
}

function AddFormula({ handleAddFormula, type }: Props) {

    return (
        <Card className="w-full">

            <div className="flex flex-col prose justify-center items-center gap-2 m-auto">
                <h2>Add a Formula</h2>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <button
                        className="px-4 py-2 text-white bg-theme_primary-500 rounded-md"
                        onClick={handleAddFormula}
                    >
                        {type === "create" ? "create a formula" : ""}
                        {type === "add" ? "Add a formula" : ""}
                    </button>
                </div>

            </div>
        </Card>
    );
}

export default AddFormula;