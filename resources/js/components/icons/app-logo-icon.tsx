import type { ImgHTMLAttributes } from 'react';

import { APP_NAME } from '@/lib/env';

import logoIcon from '@assets/logo-icon.svg';

export const AppLogoIcon = (props: ImgHTMLAttributes<HTMLImageElement>) => {
    return <img src={logoIcon} alt={APP_NAME} {...props} />;
};
