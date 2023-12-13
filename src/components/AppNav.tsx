import Link from 'next/link';
import Image from 'next/image'
import logo from './makerdigital-logo-dark.png';


const AppNavigation = () => {

    return (
        <nav className='text-dark flex justify-between items-center py-2 px-4 flex-none'>
            <h1>
                <span className="hidden">Maker Digital</span>
                <Link
                    href="/"
                >
                    <Image
                        className="cursor-pointer w-12 h-12 block"
                        src={logo}
                        alt="MakerDigital Logo"
                        width={180}
                        height={180}
                        priority
                    />
                </Link>
            </h1>
            <div className="flex gap-2 ml-auto">
                <Link
                    href="/"
                    className={`py-1 px-2 border border-shade-900 rounded-md text-shade-900 hover:border-shade hover:text-shade`}
                >
                    Dashboard
                </Link>
                <Link
                    href="https://makerdigital.io/my-account/"
                    className={`py-1 px-2 border border-shade-900 rounded-md text-shade-900 hover:border-shade hover:text-shade`}
                >
                    Account
                </Link>
            </div>
        </nav>
    );
};

export default AppNavigation;
