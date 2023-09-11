'use client';

import { useEffect, useState } from "react";
import Card from "@/components/UI/Card";
import RecentThreads from "./RecentThreads";
import SavedThreads from "./SavedThreads";
import { useRouter } from 'next/navigation';
import { log } from "console";
import Generator from "./Generator";

type LauncherProps = {
    className?: string | '';
    active?: boolean;
    setActive?: any;
};

const GeneratorLauncher = ({ className, active, setActive }: LauncherProps) => {

    const router = useRouter();

    const [threads, setThreads] = useState([]);
    const [recentThreads, setRecentThreads] = useState([]);
    const [savedThreads, setSavedThreads] = useState([]);
    const [launcherFocused, setLauncherFocused] = useState(false);

    // ###
    // ### Get recent and saved threads
    const getRecentThreads = async () => {
        try {
            const res = await fetch('/api/threads', {
                method: 'POST',
                body: JSON.stringify({
                    dataType: 'get',
                    data: {
                        _id: '',
                    },
                }),
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            const threadsRes = await res.json();
            const threadsData = threadsRes.threads;
            setThreads(threadsData);

        } catch (error) {
            console.log(error)
        };
    };

    // ###
    // ### Habdle delete thread
    const deleteThread = async (id: string) => {
        try {
            const res = await fetch(`/api/threads`, {
                method: 'POST',
                body: JSON.stringify({
                    dataType: 'delete',
                    data: {
                        _id: id,
                    },
                }),
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            const threadsRes = await res.json();
            setThreads(threadsRes.threads);
        } catch (error) {
            console.log(error)
        };
    };

    // ### 
    // ### Handle save thread
    const saveThread = async (id: string, saved: any) => {
        try {
            const res = await fetch(`/api/threads`, {
                method: 'POST',
                body: JSON.stringify({
                    dataType: 'update',
                    data: {
                        "_id": id,
                        update: {
                            "saved": saved,
                        }
                    },
                }),
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            const threadsRes = await res.json();
            setThreads(threadsRes.threads);
        } catch (error) {
            console.log(error)
        };
    };

    // ###
    // ### Format thread data
    const formatThreadData = (data: any) => {
        console.log(data)
        const recent = data.filter((thread: any) => !thread.saved);
        const saved = data.filter((thread: any) => thread.saved);

        setRecentThreads(recent);
        setSavedThreads(saved);
    }
    useEffect(() => {
        formatThreadData(threads);
    }, [threads]);

    // ###
    // ### Handle activate thread
    const handleActivateThread = async (id: string) => {
        try {
            router.push(`/generate/${id}`);
        } catch (error) {
            console.log(error)
        };
    };

    //  ###
    //  ### Get ata on load
    useEffect(() => {
        getRecentThreads();
    }, []);

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
            {/* <Card className={`!shadow-md !mb-0 !p-0 w-full overflow-hidden flex justify-between items-center gap-2 !bg-gray-100`}>
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
            </Card > */}
            <div className="bg-gray-200/50 p-4 rounded-3xl">
                <h2 className="text-xl font-bold">Generate Marketing Content from Scratch!</h2>
                <Generator launcher={true} setLauncher-focused={setLauncherFocused} handleLauncherGenerate={ } className="bg-transparent min-h-0 max-w-full" />
            </div>

            {/* animate up on load */}
            <div className="flex gap-4 items-center">

                <Card className="flex flex-col gap-2 grow">
                    <h2 className="text-xl font-bold">Recent Content</h2>
                    <RecentThreads
                        className=""
                        threads={recentThreads}
                        handleActivateThread={handleActivateThread}
                        saveThread={saveThread}
                        deleteThread={deleteThread}
                    />
                </Card>
                <Card className="flex flex-col gap-2 grow">
                    <h2 className="text-xl font-bold">Saved Content</h2>
                    <SavedThreads
                        className=""
                        threads={savedThreads}
                        handleActivateThread={handleActivateThread}
                        saveThread={saveThread}
                        deleteThread={deleteThread}
                    />
                </Card>
            </div>
        </section>
    )
}
export default GeneratorLauncher;