'use client';

import { Fragment, useEffect, useState } from "react";
import Card from "@/components/UI/Card";
import { UilAngleDoubleRight } from '@iconscout/react-unicons'
import LoadingSpinner from "@/components/LoadingSpinner";
import RecentThreads from "./RecentThreads";
import SavedThreads from "@/app/campaigns/page";

type LauncherProps = {
    className?: string | '';
    active?: boolean;
    setActive?: any;
};

const GeneratorLauncher = ({ className, active, setActive }: LauncherProps) => {

    return (
        <section className="flex flex-col gap-4 w-full">
            {/* Animate down on load */}
            <div className="flex gap-4 items-center w-full">
                {/* Pass settings in as url parameters */}
                <Card className="grow">
                    Generation template 1
                </Card>
                <Card className="grow">
                    Generation template 2
                </Card>
                <Card className="grow">
                    Generation template 3
                </Card>
            </div>

            {/* What about hitting the back arrow? can the animation be reveresed? */}

            {/* Animate up on load. On submit, open a @generate or (.)generate page after animating items into position. Be sure to pass the prompt and any settings in url params */}
            <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100`}>
                <textarea
                    className="w-full outline-none break-words p-4 resize-none bg-transparent"
                    placeholder="What should we create today?"
                    name="prompt"
                    rows={1}
                ></textarea>
                <button
                    className="px-2 text-theme_primary mt-auto"
                    type="submit"
                >
                </button>
            </Card >

            {/* animate up on load */}
            <div className="flex gap-4 items-center">

                <Card className="flex flex-col gap-2 grow">
                    <h2 className="text-xl font-bold">Recent Content</h2>
                    <RecentThreads
                        threads={[]}
                        setConversation={undefined}
                        setActive={undefined}
                        setSaved={undefined}
                        deleteThread={undefined}
                    />
                </Card>
                <Card className="flex flex-col gap-2 grow">
                    <h2 className="text-xl font-bold">Saved Content</h2>
                    <SavedThreads
                        threads={[]}
                        setConversation={undefined}
                        setActive={undefined}
                        setSaved={undefined}
                        deleteThread={undefined}
                    />
                </Card>
            </div>
        </section>
    )
}
export default GeneratorLauncher;