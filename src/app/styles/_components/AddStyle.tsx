'use client'

import Card from "@/components/_ui/Card";

type Props = {
    handleAddStyle: any;
}

function AddStyle({ handleAddStyle }: Props) {

    return (
        <Card className="w-full">

            <div className="flex flex-col gap-2 items-center justify-center mb-2 prose mx-auto">

                <h2 className="m-0">Add a Style</h2>
                <p className="text-sm text-gray-500">Adding a style of voice is easy. Just copy and paste a few examples for Apprentice to learn from. We&lsquo;ll take care of the rest.</p>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <button
                        className="px-4 py-2 text-white bg-gray-700 rounded-md"
                        onClick={handleAddStyle}
                    >
                        Add a Style
                    </button>
                </div>

            </div>
        </Card>
    );
}

export default AddStyle;