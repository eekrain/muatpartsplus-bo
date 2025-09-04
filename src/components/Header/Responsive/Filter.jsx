import IconComponent from "@/components/IconComponent/IconComponent";

const HeaderResponsiveFilter = ({ onCloseButtonClick, title }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <IconComponent
        // 25. 18 - Web - LB - 0400
        className="text-primary-700"
        onClick={onCloseButtonClick}
        src="/icons/silang24.svg"
        size="medium"
      />
      <h4 className="text-sm font-semibold leading-none text-neutral-900">
        {title}
      </h4>
      <div className="size-[24px]" />
    </div>
  );
};

export default HeaderResponsiveFilter;
