import React from 'react';
import { memo } from 'react';

type SourceItemEditButtonProps = {
	toggleOpen: () => void;
	isOpen: boolean;
	className?: string;
	openIcon: any;
	closeIcon: any;
};

const SourceItemEditButton = ({
	toggleOpen,
	isOpen,
	className,
	openIcon,
	closeIcon,
}: SourceItemEditButtonProps) => {
	return (
		<button className={className} onClick={toggleOpen}>
			{isOpen ? closeIcon : openIcon}
		</button>
	);
};

// export the component
export default memo(SourceItemEditButton);
