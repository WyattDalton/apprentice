type SourceItemDeleteButtonProps = {
	className?: string;
	item: any;
	handleDelete: (id: string) => void;
	icon: any;
};

const SourceItemDeleteButton = ({
	className,
	item,
	handleDelete,
	icon,
}: SourceItemDeleteButtonProps) => (
	<button
		className={`${className} ml-2 bg-transparent opacity-0 group-hover:opacity-100`}
		onClick={() => handleDelete(item._id)}
	>
		{icon}
	</button>
);
export default SourceItemDeleteButton;
