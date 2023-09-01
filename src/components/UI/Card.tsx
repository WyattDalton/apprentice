type CardProps = {
	className?: string;
	children: React.ReactNode;
};

const Card = ({ className, children }: CardProps) => {
	return (
		<div
			className={`card p-4 mb-6 rounded-lg overflow-hidden bg-white shadow-lg ${className}`}
		>
			{children}
		</div>
	);
};
export default Card;
