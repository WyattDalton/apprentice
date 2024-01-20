import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCog,
	faList,
	faHeart,
	faGauge,
	faInfoCircle,
	faAngleDoubleRight,
	faChevronDown,
	faChevronUp,
	faFile,
	faLink,
	faClose,
	faUser,
	faBook,
	faFlask,
	faBullhorn,
} from '@fortawesome/free-solid-svg-icons';

export const CloseIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faClose} />
	);
};

export const SettingsIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faCog} />
	);
};

export const UserIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faUser} />
	);
};

export const SourceIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faBook} />
	);
};

export const FormulaIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faFlask} />
	);
};

export const ToneIcon = ({ className }) => {
	return (
		<FontAwesomeIcon
			className={!!className ? className : ''}
			icon={faBullhorn}
		/>
	);
};
export const ListIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faList} />
	);
};

export const SaveIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faHeart} />
	);
};

export const InfoIcon = ({ className }) => {
	return (
		<FontAwesomeIcon
			className={!!className ? className : ''}
			icon={faInfoCircle}
		/>
	);
};

export const DashboardIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faGauge} />
	);
};

export const GeneratorArrowIcon = ({ className }) => {
	return (
		<FontAwesomeIcon
			className={!!className ? className : ''}
			icon={faAngleDoubleRight}
		/>
	);
};

export const ArrowDownIcon = ({ className }) => {
	return (
		<FontAwesomeIcon
			className={!!className ? className : ''}
			icon={faChevronDown}
		/>
	);
};

export const ArrowUpIcon = ({ className }) => {
	return (
		<FontAwesomeIcon
			className={!!className ? className : ''}
			icon={faChevronUp}
		/>
	);
};

export const FileIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faFile} />
	);
};

export const LinkIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faLink} />
	);
};