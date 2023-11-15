

type SingleTemplateContainerProps = {
    content: any;
    controls: any;
}
export const SingleTemplateContainer = async ({ content, controls }: SingleTemplateContainerProps) => {
    <div className="grid flex-grow grid-cols-6">
        <div className="col-span-6 lg:col-span-4 absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
            {content}
        </div>
        <div className="col-span-6 lg:col-span-2">
            {controls}
        </div>
    </div>
}