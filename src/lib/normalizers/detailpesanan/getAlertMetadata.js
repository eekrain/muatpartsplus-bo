import {
  AlertInfoEnum,
  AlertLabelEnum,
  AlertLabelResponsiveEnum,
  AlertNeedConfirmEnum,
  AlertTypeEnum,
} from "@/lib/constants/Shipper/detailpesanan/alert.enum";

export const getAlertMetadata = ({
  type,
  t,
  onLihatDetailWaktuTunggu = () => alert("Not implemented yet"),
  onLihatPerubahan = () => alert("Not implemented yet"),
  isMobile = false,
}) => {
  const info = AlertInfoEnum[type];
  if (
    type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET &&
    !AlertNeedConfirmEnum.CONFIRMATION_WAITING_PREPARE_FLEET
  )
    return false;
  if (info) return { label: t(AlertLabelEnum[type]), info: t(info) };

  if (type === AlertTypeEnum.WAITING_TIME_CHARGE) {
    return {
      label: t(AlertLabelEnum.WAITING_TIME_CHARGE),
      button: {
        onClick: onLihatDetailWaktuTunggu,
        label: t("getAlertMetadata.buttonLihatDetail", {}, "Lihat Detail"),
      },
    };
  }

  if (type === AlertTypeEnum.ORDER_CHANGES_CONFIRMATION) {
    return {
      label: t(AlertLabelEnum.ORDER_CHANGES_CONFIRMATION),
      button: {
        onClick: onLihatPerubahan,
        label: t(
          "getAlertMetadata.buttonLihatPerubahan",
          {},
          "Lihat Perubahan"
        ),
      },
      type,
    };
  }

  return {
    label: isMobile
      ? t(AlertLabelResponsiveEnum[type])
      : t(AlertLabelEnum[type]),
  };
};
