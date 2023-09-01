'use client'

import Card from "@/components/UI/Card";

type Props = {
    handleAddTone: any;
}

function AddTone({ handleAddTone }: Props) {

    return (
        <Card className="w-full">

            <div className="flex flex-col prose justify-center items-center gap-2 m-auto">
                <h2>Add a Tone</h2>
                <p className="text-sm text-gray-500">Adding your first tone of voice is easy. Just give a copy and paste a few examples for Apprentice to learn from. We'll take care of the rest.</p>

                <div className="flex flex-col items-center justify-center w-full h-full">
                    <button
                        className="px-4 py-2 text-white bg-theme_primary-500 rounded-md"
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