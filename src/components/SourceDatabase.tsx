import React from 'react';
import SourceFiles from './SourceDatabaseFiles';

type SourceDatabaseProps = {
	DBItems: any[];
	handleDBItems: (items: any[]) => void;
};

const SourceDatabase = ({ DBItems, handleDBItems }: SourceDatabaseProps) => {
	return (
		<div className="flex items-center justify-center w-full flex-col">
			<SourceFiles data={DBItems} updateDB={handleDBItems} />
		</div>
	);
};

export default SourceDatabase;