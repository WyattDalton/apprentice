import { NotificationIcon, UserIcon } from './icons';
import NavMenu from './NavMenu';

const AppNavigation = () => {
    return (
        <nav className='text-dark flex justify-between items-center py-2 px-4 flex-none'>
            <NavMenu />
            <div className='flex items-center gap-2 ml-auto'>
                <NotificationIcon className={'w-6 h-6'} />
                <UserIcon className={'w-6 h-6'} />
            </div>
        </nav>
    );
};

export default AppNavigation;
