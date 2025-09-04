import PropTypes from "prop-types";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const CardMenu = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  status,
  className,
  containerClassname,
  iconContainerClassName,
  titleClassName,
  descriptionClassName,
  actionContainerClassName,
  customAction,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "flex h-[60px] w-full items-center justify-between gap-4 px-6",
        className
      )}
    >
      {/* Container for Icon, Title, and Description */}
      <div
        className={cn(
          "flex flex-1 items-center gap-x-4 overflow-hidden",
          containerClassname
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center",
            iconContainerClassName
          )}
        >
          <IconComponent src={icon} width={40} height={40} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3
            className={cn(
              "truncate text-base font-bold text-neutral-900",
              titleClassName
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "truncate text-xs text-neutral-800",
              descriptionClassName
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Container for the action element (Button or Custom Action) */}
      <div className={cn("flex-shrink-0", actionContainerClassName)}>
        {customAction ||
          (status === "completed" ? (
            <Button
              className="pointer-events-none h-[32px] w-[177px] bg-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
              iconLeft="/icons/check16.svg"
              onClick={onClick}
              appearance={{
                iconClassName: "text-success-700",
              }}
            >
              {t("CardMenu.completedText", {}, "Selesai")}
            </Button>
          ) : (
            // MODIFICATION: Only render the Button if buttonText has a value
            buttonText && (
              <Button className="h-[32px] w-[177px]" onClick={onClick}>
                {buttonText}
              </Button>
            )
          ))}
      </div>
    </div>
  );
};

CardMenu.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  status: PropTypes.string,
  className: PropTypes.string,
  iconContainerClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
  actionContainerClassName: PropTypes.string,
  customAction: PropTypes.node,
};

CardMenu.defaultProps = {
  // MODIFICATION: Change default from "Click Me" to null
  buttonText: null,
  onClick: () => {},
  status: undefined,
  className: "",
  iconContainerClassName: "",
  titleClassName: "",
  descriptionClassName: "",
  actionContainerClassName: "",
  customAction: null,
};

export default CardMenu;
