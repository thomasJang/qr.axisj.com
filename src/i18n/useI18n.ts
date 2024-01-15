import { useTranslation, UseTranslationOptions } from "react-i18next";

export function useI18n(ns?: string | string[], options?: UseTranslationOptions<any>) {
  const { t, i18n } = useTranslation(ns, options);
  const currentLanguage = i18n.language;
  return { t, i18n, currentLanguage };
}
