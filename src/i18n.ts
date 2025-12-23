import { getRequestConfig } from 'next-intl/server';
import en from './messages/en.json';
import ko from './messages/ko.json';

const messages = {
    en,
    ko
};

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !['en', 'ko'].includes(locale)) {
        locale = 'en';
    }

    return {
        locale,
        messages: messages[locale as keyof typeof messages]
    };
});
