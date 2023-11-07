'use client'

import Card from "@/components/UI/Card";
import { type } from "os";

type Props = {
    handleAddFormula: any;
    type: string;
}

function AddFormula({ handleAddFormula, type }: Props) {

    return (
        <Card className="w-full max-w-[90%] mx-auto">

            <div className="flex flex-col prose justify-center items-center gap-2 m-auto">
                <h2>Add a Formula</h2>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <button
                        className="px-4 py-2 text-dark bg-secondary rounded-md"
                        onClick={handleAddFormula}
                    >
                        Add a formula
                    </button>
                </div>

            </div>
        </Card>
    );
}

export default AddFormula;