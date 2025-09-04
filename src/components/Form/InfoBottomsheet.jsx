import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

export const InfoBottomsheet = ({ className, title, children, render }) => {
  return (
    <BottomSheet>
      <BottomSheetTrigger
        className={cn("block size-4 text-neutral-700", className)}
      >
        <IconComponent src="/icons/info16.svg" width={16} height={16} />
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle className="w-full">{title}</BottomSheetTitle>
        </BottomSheetHeader>
        {render ? (
          <div
            className="info-bottomsheet-content px-4 pb-6 text-sm font-medium leading-[1.1]"
            dangerouslySetInnerHTML={{ __html: render }}
          />
        ) : (
          <div className="info-bottomsheet-content px-4 pb-6 text-sm font-medium leading-[1.1]">
            {children}
          </div>
        )}
      </BottomSheetContent>
    </BottomSheet>
  );
};
