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

            <div className="flex flex-col gap-2 items-center justify-center mb-2 prose mx-auto">
                <h2 className="m-0">Add a Formula</h2>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <button
                        className="px-4 py-2 text-white bg-gray-700 rounded-md"
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