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
	faChevronLeft,
	faFile,
	faLink,
	faClose,
	faUser,
	faBook,
	faFlask,
	faBullhorn,
	faBell,
	faBars,
	faPlus,
	faCheck,
	faEdit,
	faRefresh,
	faBug,
} from '@fortawesome/free-solid-svg-icons';

export const BugIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faBug} />
	);
};

export const BackChevronIcon = ({ className }) => {
	return (
		<FontAwesomeIcon
			className={!!className ? className : ''}
			icon={faChevronLeft}
		/>
	);
};

export const RefreshIcon = ({ className }) => {
	return (
		<FontAwesomeIcon
			className={!!className ? className : ''}
			icon={faRefresh}
		/>
	);
};

export const EditIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faEdit} />
	);
};

export const CheckIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faCheck} />
	);
};

export const PlusIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faPlus} />
	);
};

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

export const StyleIcon = ({ className }) => {
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

export const NotificationIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faBell} />
	);
};

export const NavMenuIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faBars} />
	);
};