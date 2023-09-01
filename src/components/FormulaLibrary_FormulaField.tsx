import { type } from 'os';
import React from 'react';

type FormulaBuilderProps = {
	newFormula: any;
	handleFormulaChange: (event: any) => void;
	handleInsertInstruction: (instruction: string) => void;
};

const FormulaBuilder = ({
	newFormula,
	handleFormulaChange,
	handleInsertInstruction,
}: FormulaBuilderProps) => {
	return (
		<div className="mt-4">
			<label
				htmlFor="formula"
				className="block font-semibold mb-2 text-gray-700 text-xl"
			>
				Build Formula
			</label>
			<div className="w-full p-4 rounded-lg overflow-hidden bg-white shadow-lg mb-4">
				<div className="w-full">
					<label
						htmlFor="formula"
						className="block mb-2 font-sm font-semibold text-gray-700"
					>
						Formula
					</label>
					<textarea
						id="formula"
						value={newFormula.formula}
						onChange={handleFormulaChange}
						rows={10}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex flex-col">
					{!!newFormula.instructions && (
						<h3 className="block mb-2 font-sm font-semibold text-gray-700">
							Instructions
							<span className="text-sm text-gray-500">(click to insert)</span>
						</h3>
					)}
					{!!newFormula.instructions && newFormula.instructions.map((instruction: any, index: any) =>
						instruction.title ? (
							<div key={index} className="flex items-center mb-2">
								<label
									key={index}
									className={`mr-2 mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${instruction.checked
										? 'bg-theme_primary-700 text-white'
										: 'bg-gray-200 text-gray-700'
										}`}
								>
									<input
										type="checkbox"
										id={`instruction-${index}`}
										checked={instruction.checked}
										onChange={(e) => {
											handleInsertInstruction(index);
										}}
										className="h-4 w-4 text-theme_primary-600 transition duration-150 ease-in-out"
									/>
									<span className="ml-2">{instruction.title}</span>
								</label>
							</div>
						) : null
					)}
				</div>
			</div>
		</div>
	);
};

export default FormulaBuilder;
