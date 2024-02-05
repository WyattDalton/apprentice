'use client'

import Card from "@/components/_ui/Card";

type Props = {
    handleAddTone: any;
}

function AddTone({ handleAddTone }: Props) {

    return (
        <Card className="w-full">

            <div className="flex flex-col gap-2 items-center justify-center mb-2 prose mx-auto">

                <h2 className="m-0">Add a Tone</h2>
                <p className="text-sm text-gray-500">Adding a tone of voice is easy. Just copy and paste a few examples for Apprentice to learn from. We&lsquo;ll take care of the rest.</p>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <button
                        className="px-4 py-2 text-white bg-gray-700 rounded-md"
                        onClick={handleAddTone}
                    >
                        Add a tone of voice
                    </button>
                </div>

            </div>
        </Card>
    );
}

export default AddTone;