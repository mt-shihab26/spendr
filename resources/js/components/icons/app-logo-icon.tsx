import logo from '@/assets/logo.svg';

export const AppLogoIcon = ({
    className,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return (
        <img
            src={logo}
            alt="Spendr"
            className={className}
            {...props}
        />
    );
};
