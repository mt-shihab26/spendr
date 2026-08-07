import logoIcon from '@assets/logo-icon.svg';

export const AppLogoIcon = ({
    className,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img src={logoIcon} alt="Spendr" className={className} {...props} />;
};
