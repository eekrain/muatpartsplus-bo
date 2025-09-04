import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "../Modal/Modal";

export const ModalFormRequestOtp = ({
  open,
  onOpenChange,
  onSubmit = () => {},
}) => {
  const { t } = useTranslation();
  const formValues = useRequestOtpStore((state) => state.formValues);
  const { setField } = useRequestOtpActions();

  const { dataUser } = useAuth();
  const verificationMethods = [
    {
      id: "whatsapp",
      icon: "/icons/verify-whatsapp.svg",
      title: "WhatsApp",
      value: dataUser?.PhoneStrip,
    },
    {
      id: "email",
      icon: "/icons/verify-email.svg",
      title: "Email",
      value: dataUser?.Email,
    },
  ];

  const handleSubmit = () => {
    onOpenChange(false);
    onSubmit();
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" />
        <div className="flex h-[338px] w-[386px] min-w-[386px] max-w-[558px] flex-col items-center justify-center gap-6 px-6 py-9">
          {/* Title */}
          <h2 className="w-[175px] max-w-[510px] text-center text-base font-bold leading-[19.2px] text-black">
            {t(
              "ModalFormRequestOtp.titleSelectVerificationMethod",
              {},
              "Pilih Metode Verifikasi"
            )}
          </h2>

          {/* Description */}
          <p className="w-[338px] max-w-[510px] text-center text-sm font-medium leading-[16.8px] text-black">
            {t(
              "ModalFormRequestOtp.descriptionSelectMethodForVerificationCode",
              {},
              "Pilih salah satu metode dibawah ini untuk mendapatkan kode verifikasi"
            )}
          </p>

          {/* Verification Method Options */}
          <div className="flex w-[338px] flex-col gap-y-3">
            {verificationMethods.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex h-14 w-full cursor-pointer flex-row items-center gap-x-2 rounded-md border border-neutral-400 bg-white px-3 transition-colors hover:border-neutral-600",
                  formValues.verificationMethod === item.id &&
                    "border-primary-700 bg-primary-50"
                )}
                onClick={() => {
                  setField("verificationMethod", item.id);
                  setField("verificationData", item.value);
                }}
              >
                {/* Method Icon */}
                <div className="flex h-6 w-6 items-center justify-center">
                  <IconComponent
                    src={item.icon}
                    width={24}
                    height={24}
                    classname="text-neutral-700"
                  />
                </div>

                {/* Method Info */}
                <div className="flex flex-col gap-y-2 text-xs font-medium">
                  <span className="w-full">{item.title}</span>
                  <span className="w-full text-neutral-600">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Verify Button */}
          <Button
            variant="muatparts-primary"
            onClick={handleSubmit}
            disabled={
              !formValues.verificationMethod && !formValues.verificationData
            }
            className="h-8 w-[112px] min-w-[112px]"
          >
            {t("buttonVerification")}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
