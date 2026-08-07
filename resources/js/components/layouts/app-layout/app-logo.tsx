import logoFullLight from '@/assets/logo-full-light.svg';
import logoFullDark from '@/assets/logo-full-dark.svg';

export const AppLogo = () => {
    return (
        <>
            <img
                src={logoFullLight}
                alt="Spendr"
                className="h-8 w-auto dark:hidden"
            />
            <img
                src={logoFullDark}
                alt="Spendr"
                className="hidden h-8 w-auto dark:block"
            />
        </>
    );
};
