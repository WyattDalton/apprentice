import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCog,
	faList,
	faHeart,
	faGauge,
	faInfoCircle,
	faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';

export const SettingsIcon = ({ className }) => {
	return (
		<FontAwesomeIcon className={!!className ? className : ''} icon={faCog} />
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