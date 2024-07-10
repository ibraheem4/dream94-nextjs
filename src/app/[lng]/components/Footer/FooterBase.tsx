import { i18n } from "i18next";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";
import { languages, fallbackLng } from "../../../i18n/settings";

export const FooterBase = ({
  i18n,
  lng,
  path = "",
}: {
  i18n: i18n;
  lng: string;
  path?: string;
}) => {
  const t = i18n.getFixedT(lng, "footer");

  const getLinkPath = (l: string) => {
    if (l === fallbackLng) {
      return path === "" ? "/" : `${path}`;
    } else {
      return `/${l}${path}`;
    }
  };

  return (
    <footer>
      <Trans i18nKey="languageSwitcher" t={t}>
        {/* @ts-expect-error Trans interpolation */}
        Switch from <strong>{{ lng }}</strong> to:{" "}
      </Trans>
      {languages
        .filter((l) => lng !== l)
        .map((l, index) => (
          <span key={l}>
            {index > 0 && " or "}
            <Link href={getLinkPath(l)} locale={false}>
              {l}
            </Link>
          </span>
        ))}
      <p>{t("description")}</p>
    </footer>
  );
};
