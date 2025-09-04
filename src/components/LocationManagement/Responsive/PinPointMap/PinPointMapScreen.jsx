import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive/ModalPostalCodeResponsive";
import { MapContainer } from "@/components/MapContainer/MapContainer";

import { useLocationContext } from "@/hooks/use-location/use-location";
import { useTranslation } from "@/hooks/use-translation";

import { useResponsiveRouteParams } from "@/lib/responsive-navigation";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

const PinPointMapScreen = () => {
  const params = useResponsiveRouteParams();
  const { t } = useTranslation();

  const { formValues } = useLocationFormStore();
  const { coordinates, handleChangeMarkerCoordinates } = useLocationContext();

  const handleSave = () => {
    params?.config?.afterLocationSelected?.();
  };

  return (
    <FormResponsiveLayout
      title={{
        label:
          formValues?.dataLokasi?.location?.name ||
          params?.dataLokasi?.location?.name,
        className: "text-sm font-semibold line-clamp-1 break-all",
      }}
    >
      <MapContainer
        viewOnly={false}
        coordinates={coordinates}
        onPositionChange={(value) =>
          handleChangeMarkerCoordinates(
            value,
            params.config?.needValidateLocationChange
          )
        }
        className="h-[calc(100vh-62px)] w-full"
      />

      <ModalPostalCodeResponsive />

      <ResponsiveFooter>
        <Button
          variant="muatparts-primary"
          className="w-full"
          onClick={handleSave}
        >
          {t("PinPointMapScreen.buttonSimpan", {}, "Simpan")}
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default PinPointMapScreen;
