import { Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState, memo } from 'react';

import Card from '../UI/Card';
import { IoSchool } from "react-icons/io5";

import Intention from './settings/Intention';
import ContentType from './settings/ContentType';
import Tone from './settings/Tone';
import Formula from './settings/Formula';
import Details from './settings/Details';
import Length from './settings/length';


type GeneratorSettingsProps = {
	handleSetGeneratorSettings: (settings: any) => void;
	generatorSettings: any;
	toneLibrary: any[];
	formulaLibrary: any[];
	activateSettings: boolean;
	setActivateSettings: any;
	className?: string | '';
};

function GeneratorSettings({
	handleSetGeneratorSettings,
	generatorSettings,
	toneLibrary,
	formulaLibrary,
	activateSettings,
	setActivateSettings,
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
		<Transition
			className={`${className}`}
			show={activateSettings}
			enter="transition-all duration-300"
			enterFrom="translate-x-10 opacity-0"
			enterTo="translate-x-0 opacity-100"
			leave="transition-all duration-300"
			leaveFrom="translate-x-0 opacity-100"
			leaveTo="translate-x-10 opacity-0"
			unmount={true}
		>
			<div className="w-full transition-all ease-in-out duration-300 flex flex-col gap-4 sticky top-4 max-h-100vh">
				<div className="settings-controls flex flex-col gap-4 relative h-full overflow-y-auto">

					<Card className="!mb-0 flex justify-between gap-2">
						<div className="flex gap-2 mb-2">
							<IoSchool className="w-6 h-6 text-theme_primary-700" />
							<span className="block font-semibold">Use Sources</span>
						</div>
						<div className="relative inline-block w-10 mt-0 align-middle select-none transition duration-200 ease-in">
							<input
								type="checkbox"
								name="useSources"
								id="useSources"
								checked={useSources}
								onChange={() => setUseSources(!useSources)}
								className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer ${useSources
									? 'left-full -translate-x-full border-theme_primary-700'
									: 'left-0'
									}`}
							/>
							<label
								htmlFor="useSources"
								className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer border-2 border-gray-300 ${useSources ? 'bg-theme_primary-700 border-theme_primary-700' : 'bg-gray-300'
									}`}
							></label>
						</div>
					</Card>

					<Intention
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
						settingFocus={settingFocus}
						setSettingFocus={setSettingFocus}
						toneLibrary={toneLibrary}
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
			</div>
		</Transition>
	);
}
export default memo(GeneratorSettings);
