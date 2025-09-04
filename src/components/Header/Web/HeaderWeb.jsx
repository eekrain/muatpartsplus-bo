"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { useOverlayAction } from "@/store/Shared/overlayStore";

import { DownloadPopover } from "./DownloadPopover";
import LanguageDropdown from "./LanguageDropdown";
import { UserDropdown } from "./UserDropdown";

const WHITELIST_HEADER_TAKE_FULL_WITH = [
  // /daftarpesanan/detailpesanan/uuid/lacak-armada/uuid
  /^\/daftarpesanan\/detailpesanan\/[^/]+\/lacak-armada/,
];

/**
 * Header komponen untuk Muatparts Seller Dashboard
 * Berdasarkan gambar header yang disediakan
 */
const HeaderWeb = ({
  notifCounter = {
    notification: 0,
    chat: 0,
  },
}) => {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();

  const menuNotifications = [
    {
      src: "/icons/messages.svg",
      count: notifCounter.chat,
    },
    {
      src: "/icons/notifications.svg",
      count: notifCounter.notification,
    },
  ];

  const settingsMenu = [
    {
      label: t("HeaderWeb.settingsMenuManajemenLokasi", {}, "Manajemen Lokasi"),
      onClick: () => {
        alert("Handle redirect general manajemen lokasi");
      },
    },
    {
      label: t("HeaderWeb.settingsMenuRekeningBank", {}, "Rekening Bank"),
      onClick: () => {
        alert("Handle redirect general rekening bank");
      },
    },
  ];

  const [openSettings, setOpenSettings] = useState(false);
  const { setIsOverlayActive } = useOverlayAction();

  useEffect(() => {
    setIsOverlayActive(openSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSettings]);

  const headerTakeFullWidth = WHITELIST_HEADER_TAKE_FULL_WITH.some((regex) =>
    regex.test(pathname)
  );

  return (
    <header className="sticky left-0 top-0 z-20 w-full">
      <div className="bg-muat-trans-primary-400">
        <div
          className={cn(
            "mx-auto flex h-[60px] max-w-[1200px] items-center justify-between text-neutral-900",
            headerTakeFullWidth && "max-w-auto w-full px-10"
          )}
        >
          <div className="flex items-center gap-x-6">
            <ImageComponent
              src="/icons/muattrans.svg"
              width={136}
              height={27}
            />
            <DownloadPopover />
            <LanguageDropdown />
          </div>
          <div className="flex items-center gap-x-6">
            <Link
              className="capsize text-xs font-medium leading-[12px]"
              href={process.env.NEXT_PUBLIC_INTERNAL_WEB}
            >
              {t("HeaderWeb.linkKembaliKeMuatmuat", {}, "Kembali ke muatmuat")}
            </Link>
            <Link
              className="capsize text-xs font-medium leading-[12px]"
              href={`${
                process.env.NEXT_PUBLIC_INTERNAL_WEB
              }traffic/redirect_faq?from=gen`}
            >
              {t("HeaderWeb.linkPusatBantuan", {}, "Pusat Bantuan")}
            </Link>

            <div className="flex items-center gap-x-3">
              {isLoggedIn && (
                <div className="flex items-center gap-x-3 pr-3">
                  {menuNotifications.map((menu, key) => (
                    <Link href="#" className="relative" key={key}>
                      <div className="absolute bottom-3 left-3 flex h-3.5 items-center rounded-[30px] border-[1.5px] border-muat-trans-secondary-900 bg-buyer-seller-900 px-1.5">
                        <span className="text-xxs font-medium leading-[8px] text-neutral-50">
                          {menu.count}
                        </span>
                      </div>
                      <IconComponent
                        src={menu.src}
                        className="size-6 text-muat-trans-secondary-900"
                      />
                    </Link>
                  ))}
                </div>
              )}
              <hr className="h-5 border border-neutral-400" />
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <div className="bg-muat-trans-secondary-900">
          <div
            className={cn(
              "mx-auto flex h-8 w-full max-w-[1200px] items-center gap-6 text-xs font-medium leading-[1] text-neutral-50",
              headerTakeFullWidth && "max-w-auto w-full px-10"
            )}
          >
            <span className="block">
              {t("HeaderWeb.labelMenu", {}, "Menu :")}
            </span>

            <Link
              href="/sewaarmada"
              className={cn(
                "flex h-8 items-center gap-1 border-b-2 border-transparent",
                pathname.startsWith("/sewaarmada") &&
                  "border-muat-trans-primary-400"
              )}
            >
              <IconComponent src="/icons/header-pesan-jasa-angkut.svg" />
              <span className="capsize">
                {t("HeaderWeb.navPesanJasaAngkut", {}, "Pesan Jasa Angkut")}
              </span>
            </Link>

            <Link
              href="/daftarpesanan"
              className={cn(
                "flex h-8 items-center gap-1 border-b-2 border-transparent",
                pathname.startsWith("/daftarpesanan") &&
                  "border-muat-trans-primary-400"
              )}
            >
              <IconComponent src="/icons/header-daftar-pesanan.svg" />
              <span className="capsize">
                {t("HeaderWeb.navDaftarPesanan", {}, "Daftar Pesanan")}
              </span>
            </Link>

            <SimpleDropdown open={openSettings} onOpenChange={setOpenSettings}>
              <SimpleDropdownTrigger asChild>
                <button className="flex h-8 items-center gap-1 border-b-2 border-transparent outline-none">
                  <IconComponent src="/icons/header-pengaturan.svg" />
                  <span className="capsize">
                    {t("HeaderWeb.navPengaturan", {}, "Pengaturan")}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      openSettings && "rotate-180"
                    )}
                  />
                </button>
              </SimpleDropdownTrigger>

              <SimpleDropdownContent className="w-[194px]">
                {settingsMenu.map((menu, key) => (
                  <SimpleDropdownItem key={key} onClick={menu.onClick}>
                    {menu.label}
                  </SimpleDropdownItem>
                ))}
              </SimpleDropdownContent>
            </SimpleDropdown>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderWeb;
