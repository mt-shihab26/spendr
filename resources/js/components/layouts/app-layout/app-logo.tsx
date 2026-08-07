import logoFull from '@/assets/logo-full.svg';
import logoFullDark from '@/assets/logo-full-dark.svg';

export const AppLogo = () => {
    return (
        <>
            <img src={logoFull} alt="Spendr" className="h-8 w-auto dark:hidden" />
            <img src={logoFullDark} alt="Spendr" className="h-8 w-auto hidden dark:block" />
        </>
    );
};
