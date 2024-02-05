import { Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState, memo } from 'react';

import Card from '@/components/_ui/Card';
import { IoSchool } from "react-icons/io5";

import Intention from './settings/Intention';
import ContentType from './settings/ContentType';
import Tone from './settings/Tone';
import Formula from './settings/Formula';
import Details from './settings/Details';
import Length from './settings/Length';


type GeneratorSettingsProps = {
	handleSetGeneratorSettings: (settings: any) => void;
	generatorSettings: any;
	toneLibrary: any[];
	formulaLibrary: any[];
	className?: string | '';
};

function GeneratorSettings({
	handleSetGeneratorSettings,
	generatorSettings,
	toneLibrary,
	formulaLibrary,
	className
}: GeneratorSettingsProps) {

	const [enabled, setEnabled] = useState(generatorSettings.enabled || false);
	const [contentType, setContentType] = useState(generatorSettings.contentType || '');
	const [tone, setTone] = useState(generatorSettings.tone || '');
	const [intention, setIntention] = useState(generatorSettings.intention || '');
	const [length, setLength] = useState(generatorSettings.length || 0);
	const [formula, setFormula] = useState(generatorSettings.formula || '');
	const [useSources, setUseSources] = useState(generatorSettings.useSources || false);
	const [details, setDetails] = useState(generatorSettings.details || '');

	const [settingFocus, setSettingFocus] = useState<any>(false);


	useEffect(() => {
		!!contentType || !!tone || !!intention || !!length || !!formula || !!details || !!useSources ? setEnabled(true) : setEnabled(false);

		handleSetGeneratorSettings({
			enabled,
			contentType,
			tone,
			intention,
			length,
			details,
			formula,
			useSources,
		});
	}, [
		contentType,
		tone,
		intention,
		length,
		details,
		formula,
		useSources,
		enabled,
	]);

	return (

		<div className={`w-full transition-all ease-in-out duration-300 gap-4 flex flex-col flex-wrap ${!!className ? ` ${className}` : ''}`}>

			<Card className="!mb-0 flex justify-between items-center gap-2 flex-grow">
				<div className="flex gap-2 justify-center items-center w-full flex-col lg:flex-row">
					<IoSchool className="w-6 h-6 text-gray" />
					<span className="block font-semibold lg:mr-auto">Use Sources</span>

					<div className="relative inline-block w-10 mb-auto align-middle select-none transition duration-200 ease-in">
						<input
							type="checkbox"
							name="useSources"
							id="useSources"
							checked={useSources}
							onChange={() => setUseSources(!useSources)}
							className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2  appearance-none cursor-pointer ${useSources
								? 'left-full -translate-x-full border-gray-700'
								: 'left-0 border-gray-500'
								}`}
						/>
						<label
							htmlFor="useSources"
							className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer border-2  ${useSources ? 'bg-gray-700 border-gray-700' : 'bg-gray-500 border-gray-500'
								}`}
						></label>
					</div>
				</div>
			</Card>

			<Intention
				className="!mb-0 flex flex-col justify-center items-center gap-2 flex-grow"
				intention={intention}
				setIntention={setIntention}
				settingFocus={settingFocus}
				setSettingFocus={setSettingFocus}
			/>

			<ContentType
				contentType={contentType}
				setContentType={setContentType}
				settingFocus={settingFocus}
				setSettingFocus={setSettingFocus}
			/>

			<Tone
				tone={tone}
				setTone={setTone}
				toneLibrary={toneLibrary}
				settingFocus={settingFocus}
				setSettingFocus={setSettingFocus}
			/>

			<Formula
				formula={formula}
				setFormula={setFormula}
				formulaLibrary={formulaLibrary}
				settingFocus={settingFocus}
				setSettingFocus={setSettingFocus}
			/>

			<Length
				length={length}
				setLength={setLength}
				settingFocus={settingFocus}
				setSettingFocus={setSettingFocus}
			/>

			<Details
				details={details}
				setDetails={setDetails}
				settingFocus={settingFocus}
				setSettingFocus={setSettingFocus}
			/>
		</div>
	);
}
export default memo(GeneratorSettings);
