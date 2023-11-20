import React from "react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


type GeneratorContentProps = {
    conversation: any;
    className?: string | '';
};

const GeneratorContent = ({ conversation, className }: GeneratorContentProps) => {

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
        <div className={`${className}`}>
            {conversation.map((item: { id: React.Key | null | undefined; role: string; content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.PromiseLikeOfReactNode | null | undefined; }, index: any) => (
                <>
                    {item.role === 'assistant' && (
                        <div key={item.id} className="relative ">
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
                </>
            ))}
        </div>
    );
}


export default GeneratorContent