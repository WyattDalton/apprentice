
import React, { Fragment, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import KnotSources from "./knot_components/KnotSources";
import KnotUserPrompt from "./knot_components/KnotUserPrompt";
import KnotThinkAbout from "./knot_components/KnotThinkAbout";
import KnotOutline from "./knot_components/KnotOutline";


type GeneratorContentProps = {
    thread: any;
    className?: string | '';
};

const GeneratorContent = ({ thread, className }: GeneratorContentProps) => {

    return (
        <div className={`${className}`}>
            {thread.map((item: any, index: any) => (

                <div className="flex flex-col gap-6 justify-start" key={index}>
                    {!!item.user_prompt ? (
                        <KnotUserPrompt item={item} index={index} />
                    ) : ('')}

                    {!!item.sources?.length ? (
                        <KnotSources index={index} sources={item.sources} />
                    ) : (
                        ''
                    )}

                    {!!item.thinkAbout?.length ? (
                        <KnotThinkAbout thinking={item.thinkAbout} index={index} />
                    ) : ('')}

                    {!!item.outline?.length ? (
                        <KnotOutline outline={item.outline} index={index} />
                    ) : ('')}

                    {!!item.response ? (
                        <div key={`${index}-response`} className="relative p-4 bg-white rounded-lg">
                            <div className="flex flex-col prose relative group/actions">
                                <ReactMarkdown
                                    className="mt-0"
                                    linkTarget="_blank"
                                    transformLinkUri={null}
                                    skipHtml={false}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {(item.response || '') as string}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ) : ('')}
                </div>
            ))}
        </div>
    );
}


export default GeneratorContent