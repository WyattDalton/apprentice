import React from "react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


type GeneratorContentProps = {
    conversation: any;
};

const GeneratorContent = ({ conversation }: GeneratorContentProps) => {

    useEffect(() => {
        const handleScroll = () => {
            const stickyElements = document.querySelectorAll(".sticky-message");
            let currentSticky: any;

            stickyElements.forEach((sticky, index) => {
                const stickyContainer = sticky.querySelector(".sticky-content");
                const stickyContent = sticky.querySelector(".sticky-content") as any;
                const nextSticky = stickyElements[index + 1];

                const rectSticky = sticky.getBoundingClientRect();
                const viewportOffsetTop = 0; // You can adjust this if you have a header or other element offsetting your stickies

                if (rectSticky.top <= viewportOffsetTop && (!nextSticky || (nextSticky && rectSticky.bottom < nextSticky.getBoundingClientRect().top))) {
                    currentSticky = sticky;
                }

                // if stickyContent is null, stop
                if (!stickyContent) return;

                if (nextSticky) {
                    const rectNextSticky = nextSticky.getBoundingClientRect();
                    const distanceApart = rectNextSticky.top - rectSticky.bottom;

                    if (distanceApart <= 20 && distanceApart >= 10) {
                        const opacity = (distanceApart - 10) / 10;
                        stickyContent.style.opacity = Math.max(opacity, 0);
                    } else if (distanceApart < 10) {
                        stickyContent.style.opacity = '0';
                    } else {
                        stickyContent.style.opacity = '1';
                    }
                }
            });

            // Remove shadow-md class from all stickies
            stickyElements.forEach(sticky => sticky.classList.remove("shadow-md"));

            // Add shadow-md class to the current sticky
            if (currentSticky) currentSticky.classList.add("shadow-md");

            // Remove bg-white class from all stickies
            stickyElements.forEach(sticky => sticky.classList.remove("bg-white"));

            // Add bg-white class to the current sticky
            if (currentSticky) currentSticky.classList.add("bg-white");
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div >
            {conversation.map((item: { id: React.Key | null | undefined; role: string; content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.PromiseLikeOfReactNode | null | undefined; }, index: any) => (
                <React.Fragment key={item.id}>
                    {item.role === 'user' && (
                        <>
                            <div className="w-full p-2 sticky sticky-message top-0 z-10 rounded-b-3xl transition-all duration-300">
                                <div className="sticky-content flex justify-end items-center gap-5 p-2 px-6 rounded-tl-3xl rounded-b-3xl roundedtr-sm prose bg-gray-100 ml-auto p-2 max-w-max transition-opacity duration-300">
                                    <h2 className="text-sm m-0 flex items-center">{item.content}</h2>
                                    <span className="rounded-full h-10 w-10 bg-gray-400 p-2 flex items-center justify-center">MD</span>
                                </div>
                            </div>
                        </>
                    )}

                    {item.role === 'assistant' && (
                        <div key={item.id} className="relative mt-4 m-y-8 mr-auto mb-4 p-2 px-6 prose anchor-message bg-gray-50 rounded-3xl rounded-tl-sm">
                            <div className="flex flex-col prose mx-auto relative group/actions">
                                <ReactMarkdown
                                    className="mt-0"
                                    linkTarget="_blank"
                                    transformLinkUri={null}
                                    skipHtml={false}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {(item.content || '') as string}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}


export default GeneratorContent