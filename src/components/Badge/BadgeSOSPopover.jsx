"use client";

import Button from "@/components/Button/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";

import { useTranslation } from "@/hooks/use-translation";

import { getStatusPesananMetadataCS } from "@/lib/normalizers/CS/getStatusPesananMetadata";

import IconComponent from "../IconComponent/IconComponent";
import { NewTimelineItem, TimelineContainer } from "../Timeline";
import BadgeStatus from "./BadgeStatus";

export const BadgeSOSPopover = ({
  data = null,
  onClick = () => {},
  onClose = () => {},
  footer,
}) => {
  const { t } = useTranslation();

  const statusPesanan = getStatusPesananMetadataCS({
    orderStatus: "LOADING",
    orderStatusUnit: 1,
    truckCount: 1,
    t,
  });

  if (!data) return null;

  return (
    <Popover open={Boolean(data)} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="h-auto flex-1 justify-start p-0 text-xs font-medium"
          onClick={onClick}
        >
          {t("BadgeSOSPopover.viewSosButton", {}, "Lihat SOS")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-20 w-[305px] place-content-center rounded-xl border-none bg-white p-0 shadow-none"
        align="start"
        side="top"
        sideOffset={-18}
      >
        <div className="relative flex items-center gap-3 px-3 pt-4">
          <div className="flex items-center gap-2">
            <img
              src={data?.truckIcon || "/icons/armada-truck/truck-blue.png"}
              alt=""
              className="h-3 w-[42px] object-contain"
            />
            <h1 className="font-bold leading-tight text-neutral-900">
              {data?.licensePlate}
            </h1>
          </div>

          <span className="rounded-md bg-error-400 px-2 py-1 text-xs font-semibold text-white">
            SOS
          </span>

          {/* Close Button */}
          <button className="absolute right-2 top-2" onClick={onClose}>
            <IconComponent
              src="/icons/close24.svg"
              alt="Close modal"
              className="h-4 w-4 text-neutral-700"
            />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="mt-[14px] max-h-[388px] flex-1 space-y-3 overflow-y-auto px-3">
          {/* Incident Details */}
          <div className="space-y-3">
            {data?.category || data?.description ? (
              <div>
                <p className="text-xs font-semibold leading-none text-error-400">
                  {data?.category || "-"}
                </p>
                {data?.description && (
                  <p className="mt-1.5 text-xs font-medium text-neutral-900">
                    {data?.description}
                  </p>
                )}
              </div>
            ) : null}

            {data?.images && data?.images.length > 0 && (
              <div className="flex items-center gap-2">
                {data?.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Incident image ${index + 1}`}
                    className="h-10 w-10 cursor-pointer rounded-md object-cover"
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <IconComponent
                src="/icons/clock.svg"
                alt="Report time"
                className="h-3 w-3 text-muat-trans-secondary-900"
              />
              <p className="text-xs font-medium text-neutral-600">
                Laporan Masuk :{" "}
                <span className="text-neutral-900">{data?.reportTime}</span>
              </p>
            </div>
          </div>

          <hr className="border-neutral-400" />

          {/* Fleet & Driver Info */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-900">
              {data?.vehicleType}
            </p>
            <div className="space-y-2">
              <InfoRow
                icon="/icons/profile16.svg"
                label="Driver"
                value={data?.driverName}
              />
              <InfoRow
                icon="/icons/contact.svg"
                label="No. HP Driver"
                value={data?.driverPhone}
              />
              <InfoRow
                icon="/icons/marker-outline.svg"
                label="Lokasi Terakhir"
                value={data?.lastLocation}
              />
            </div>
          </div>

          <hr className="border-t border-neutral-400" />

          {/* Order Details */}
          <div className="rounded-lg bg-neutral-100 p-3">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-neutral-600">
                  No. Pesanan
                </p>
                <p className="mt-2 text-xs font-semibold text-neutral-900">
                  {data?.orderNumber}
                </p>
              </div>
              <div>
                <p className="mb-3 text-xs font-medium text-neutral-600">
                  Rute Muat & Bongkar
                </p>

                <TimelineContainer>
                  {[
                    {
                      title: data?.pickupLocation,
                    },
                    {
                      title: data?.dropoffLocation,
                    },
                  ].map((item, index) => (
                    <NewTimelineItem
                      key={index}
                      variant="bullet"
                      index={index}
                      activeIndex={0}
                      isLast={index === 1}
                      title={item.title}
                      className="pb-2"
                      appearance={{
                        titleClassname: "font-bold text-xs",
                      }}
                    />
                  ))}
                </TimelineContainer>
              </div>

              <div className="flex items-center justify-between">
                <BadgeStatus
                  variant={statusPesanan.variant}
                  className="inline-flex w-auto flex-shrink-0"
                >
                  {statusPesanan.label}
                </BadgeStatus>
                <Button
                  variant="link"
                  className="text-xs"
                  onClick={() => alert("Viewing order details")}
                >
                  Lihat Detail
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-4 px-3 pb-3">{footer}</div>
      </PopoverContent>
    </Popover>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 self-stretch">
    <IconComponent
      src={icon}
      alt={`${label} icon`}
      className="h-3 w-3 flex-shrink-0 text-muat-trans-secondary-900"
    />
    <div className="flex flex-1 items-center gap-x-1">
      <span className="flex-shrink-0 whitespace-nowrap text-xs font-medium leading-none text-neutral-600">
        {label} :
      </span>
      <span className="line-clamp-1 break-all text-xs font-medium leading-none text-neutral-900">
        {value}
      </span>
    </div>
  </div>
);
