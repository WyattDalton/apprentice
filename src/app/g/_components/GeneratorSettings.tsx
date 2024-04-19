import { Switch, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState, memo } from 'react';

import Card from '@/components/_ui/Card';
import { IoSchool } from "react-icons/io5";

import Intention from './settings/Intention';
import ContentType from './settings/ContentType';
import Style from './settings/Style';
import Formula from './settings/Formula';
import Details from './settings/Details';
import Length from './settings/Length';


type GeneratorSettingsProps = {
	handleSetGeneratorSettings: (settings: any) => void;
	generatorSettings: any;
	styleLibrary: any[];
	formulaLibrary: any[];
	className?: string | '';
};

function GeneratorSettings({
	handleSetGeneratorSettings,
	generatorSettings,
	styleLibrary,
	formulaLibrary,
	className
}: GeneratorSettingsProps) {

	const [enabled, setEnabled] = useState(generatorSettings.enabled || false);
	const [contentType, setContentType] = useState(generatorSettings.contentType || '');
	const [style, setStyle] = useState(generatorSettings.style || '');
	const [intention, setIntention] = useState(generatorSettings.intention || '');
	const [length, setLength] = useState(generatorSettings.length || 0);
	const [formula, setFormula] = useState(generatorSettings.formula || '');
	const [useSources, setUseSources] = useState(generatorSettings.useSources || false);
	const [details, setDetails] = useState(generatorSettings.details || '');

	const [settingFocus, setSettingFocus] = useState<any>(false);


	useEffect(() => {
		!!contentType || !!style || !!intention || !!length || !!formula || !!details || !!useSources ? setEnabled(true) : setEnabled(false);

		handleSetGeneratorSettings({
			enabled,
			contentType,
			style,
			intention,
			length,
			details,
			formula,
			useSources,
		});
	}, [
		contentType,
		style,
		intention,
		length,
		details,
		formula,
		useSources,
		enabled,
	]);

	return (

		<div className={`gap-4 flex flex-col ${!!className ? ` ${className}` : ''}`}>
			<div className="flex gap-4 justify-between items-center w-full flex-row">
				<button
					onClick={() => setUseSources(!useSources)}
					className="flex gap-2 items-center bg-white rounded-full py-2 px-4 border-gray-700 border">
					<IoSchool className="w-6 h-6 text-gray" />
					<span className="block font-semibold lg:mr-auto">Use Sources</span>
					<Switch
						checked={useSources}
						className={`${useSources ? 'bg-gray-700' : 'bg-gray-500'
							} relative inline-flex h-6 w-11 items-center rounded-full`}
					>
						<span className="sr-only">Use Sources</span>
						<span
							className={`${!!useSources ? 'translate-x-6' : 'translate-x-1'
								} inline-block h-4 w-4 transform rounded-full bg-white transition`}
						/>
					</Switch>
				</button>


			</div>

			<Style
				style={style}
				setStyle={setStyle}
				styleLibrary={styleLibrary}
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
		</div>
	);
}
export default memo(GeneratorSettings);
