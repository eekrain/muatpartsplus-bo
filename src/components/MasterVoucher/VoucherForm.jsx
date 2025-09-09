"use client";

import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { MyTextArea } from "@/components/Form/TextArea";
import { LocationSelector } from "@/components/MasterVoucher/LocationSelector";
import MultiSelectDropdown from "@/components/MultiSelectDropdown/MultiSelectDropdown";
import RadioButton from "@/components/Radio/RadioButton";

import {
  useAddVoucherActions,
  useAddVoucherFormErrors,
  useAddVoucherFormValues,
} from "@/store/MasterVoucher/addVoucherStore";

const userOptions = [
  { value: "081236632731", label: "081236632731" },
  { value: "081234654673", label: "081234654673" },
  { value: "085737737171", label: "085737737171" },
  { value: "085737737172", label: "085737737172" },
  { value: "085737737173", label: "085737737173" },
  { value: "085737737174", label: "085737737174" },
  { value: "085737737175", label: "085737737175" },
  { value: "085737737176", label: "085737737176" },
  { value: "085737737177", label: "085737737177" },
  { value: "085737737178", label: "085737737178" },
];

const paymentMethodOptions = [
  { value: "credit-card-bca", label: "Credit Card - BCA" },
  {
    value: "transfer-virtual-account-bca",
    label: "Transfer Virtual Account - BCA",
  },
  {
    value: "transfer-virtual-account-mandiri",
    label: "Transfer Virtual Account - Mandiri",
  },
  {
    value: "transfer-virtual-account-bri",
    label: "Transfer Virtual Account - BRI",
  },
  {
    value: "transfer-virtual-account-danamon",
    label: "Transfer Virtual Account - Danamon",
  },
  { value: "gopay", label: "GoPay" },
  { value: "shopeepay", label: "ShopeePay" },
];

const VoucherForm = ({ mode = "add" }) => {
  const formValues = useAddVoucherFormValues();
  const formErrors = useAddVoucherFormErrors();
  const { setField } = useAddVoucherActions();

  const isDetail = mode === "detail";
  const isEdit = mode === "edit";

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        <div className="space-y-6">
          <FormContainer>
            <FormLabel>Tanggal Pembuatan</FormLabel>
            <Input
              value={formValues.tanggalPembuatan}
              readOnly
              appearance={{ inputClassName: " disabled:!text-[#868686]" }}
              disabled
            />
          </FormContainer>

          <FormContainer>
            <FormLabel required>Kode Voucher</FormLabel>
            <Input
              placeholder="Masukkan Kode Voucher"
              value={formValues.kodeVoucher}
              onChange={(e) =>
                setField("kodeVoucher", e.target.value.toUpperCase())
              }
              errorMessage={formErrors.kodeVoucher}
              disabled={isDetail || isEdit} // Disabled di detail dan edit
              readOnly={isDetail || isEdit}
            />
          </FormContainer>

          <FormContainer>
            <FormLabel required>Syarat dan Ketentuan</FormLabel>
            <MyTextArea
              placeholder="Masukkan Syarat dan Ketentuan"
              value={formValues.syaratDanKetentuan}
              onChange={(e) => setField("syaratDanKetentuan", e.target.value)}
              errorMessage={formErrors.syaratDanKetentuan}
              appearance={{ inputClassName: "min-h-[66px]" }}
              disabled={isDetail}
              autoResize={true}
              readOnly={isDetail}
            />
          </FormContainer>

          <FormContainer>
            <FormLabel required>Cara Pemakaian</FormLabel>
            <MyTextArea
              placeholder="Masukkan Cara Pemakaian"
              value={formValues.caraPemakaian}
              onChange={(e) => setField("caraPemakaian", e.target.value)}
              errorMessage={formErrors.caraPemakaian}
              appearance={{ inputClassName: "min-h-[66px]" }}
              disabled={isDetail}
              autoResize={true}
              readOnly={isDetail}
            />
          </FormContainer>

          {/* Sisa form dengan prop disabled={isDetail} */}
          <FormContainer>
            <FormLabel required>Jenis Potongan</FormLabel>
            <div className="flex gap-4">
              <RadioButton
                name="jenisPotongan"
                label="Rp x"
                value="Rp x"
                checked={formValues.jenisPotongan === "Rp x"}
                onChange={(e) => setField("jenisPotongan", e.target.value)}
                disabled={isDetail || isEdit}
              />
              <RadioButton
                name="jenisPotongan"
                label="x %"
                value="x %"
                checked={formValues.jenisPotongan === "x %"}
                onChange={(e) => setField("jenisPotongan", e.target.value)}
                disabled={isDetail || isEdit}
              />
            </div>
          </FormContainer>

          <FormContainer>
            <FormLabel required>Nominal</FormLabel>
            <Input
              placeholder="Masukkan Nominal"
              value={
                formValues.nominal
                  ? Number(formValues.nominal).toLocaleString("id-ID")
                  : ""
              }
              onChange={(e) =>
                setField("nominal", e.target.value.replace(/\D/g, ""))
              }
              errorMessage={formErrors.nominal}
              disabled={isDetail || isEdit}
              readOnly={isDetail}
            />
          </FormContainer>

          {formValues.jenisPotongan === "x %" && (
            <FormContainer className="items-center !gap-y-0">
              <FormLabel required>Maksimal Potongan (Rp)</FormLabel>
              <div className="flex gap-4">
                <RadioButton
                  name="maksimalPotongan"
                  label="Tidak Ada"
                  value="Tidak Ada"
                  checked={formValues.maksimalPotonganRp === ""}
                  onChange={() => setField("maksimalPotonganRp", "")}
                  disabled={isDetail || isEdit}
                />
                <RadioButton
                  name="maksimalPotongan"
                  label="Atur Maks. Potongan"
                  value="Atur Maks. Potongan"
                  checked={formValues.maksimalPotonganRp !== ""}
                  onChange={() => setField("maksimalPotonganRp", "0")}
                  disabled={isDetail || isEdit}
                />
              </div>
              {formValues.maksimalPotonganRp !== "" && (
                <>
                  <div></div>
                  <Input
                    placeholder="Masukkan Maks. Potongan"
                    value={
                      formValues.maksimalPotonganRp
                        ? Number(formValues.maksimalPotonganRp).toLocaleString(
                            "id-ID"
                          )
                        : ""
                    }
                    onChange={(e) =>
                      setField(
                        "maksimalPotonganRp",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    className="mt-2"
                    errorMessage={formErrors.maksimalPotonganRp}
                    disabled={isDetail || isEdit}
                    readOnly={isDetail}
                  />
                </>
              )}
            </FormContainer>
          )}

          <FormContainer className="items-center !gap-y-0">
            <FormLabel required>Minimal Transaksi (Rp)</FormLabel>
            <div className="flex gap-4">
              <RadioButton
                name="minimalTransaksi"
                label="Tidak Ada"
                value="Tidak Ada"
                checked={formValues.minimalTransaksiRp === ""}
                onChange={() => setField("minimalTransaksiRp", "")}
                disabled={isDetail || isEdit}
              />
              <RadioButton
                name="minimalTransaksi"
                label="Atur Min. Transaksi"
                value="Atur Min. Transaksi"
                checked={formValues.minimalTransaksiRp !== ""}
                onChange={() => setField("minimalTransaksiRp", "0")}
                disabled={isDetail || isEdit}
              />
            </div>
            {formValues.minimalTransaksiRp !== "" && (
              <>
                <div></div>
                <Input
                  placeholder="Masukkan Min. Transaksi"
                  value={
                    formValues.minimalTransaksiRp
                      ? Number(formValues.minimalTransaksiRp).toLocaleString(
                          "id-ID"
                        )
                      : ""
                  }
                  onChange={(e) =>
                    setField(
                      "minimalTransaksiRp",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  className="mt-2"
                  errorMessage={formErrors.minimalTransaksiRp}
                  disabled={isDetail || isEdit}
                  readOnly={isDetail}
                />
              </>
            )}
          </FormContainer>
        </div>
        <div className="mt-6 space-y-6 md:mt-0">
          <FormContainer>
            <FormLabel required>Periode Awal</FormLabel>
            <DatePicker
              placeholder="dd/mm/yyyy"
              value={
                formValues.periodeAwal ? new Date(formValues.periodeAwal) : null
              }
              onChange={(date) =>
                setField("periodeAwal", date?.toISOString().split("T")[0] || "")
              }
              errorMessage={formErrors.periodeAwal}
              iconPosition="right"
              disabled={isDetail || isEdit}
            />
          </FormContainer>
          <FormContainer>
            <FormLabel required>Periode Akhir</FormLabel>
            <DatePicker
              placeholder="dd/mm/yyyy"
              value={
                formValues.periodeAkhir
                  ? new Date(formValues.periodeAkhir)
                  : null
              }
              onChange={(date) =>
                setField(
                  "periodeAkhir",
                  date?.toISOString().split("T")[0] || ""
                )
              }
              minDate={
                formValues.periodeAwal
                  ? new Date(formValues.periodeAwal)
                  : undefined
              }
              errorMessage={formErrors.periodeAkhir}
              iconPosition="right"
              disabled={isDetail}
            />
          </FormContainer>
          <FormContainer>
            <FormLabel required>User (No. WhatsApp)</FormLabel>
            <MultiSelectDropdown
              options={userOptions}
              selectedItems={formValues.userWhatsApp}
              placeholder="Pilih User"
              onSelectionChange={(selectedUsers) =>
                setField("userWhatsApp", selectedUsers)
              }
              titleModal="User (No. WhatsApp)"
              errorMessage={formErrors.userWhatsApp}
              showAllOption={true}
              disabled={isDetail}
            />
          </FormContainer>
          <FormContainer>
            <FormLabel required>Kuota Voucher</FormLabel>
            <Input
              placeholder="Masukkan Kuota Voucher"
              value={
                formValues.kuotaVoucher
                  ? Number(formValues.kuotaVoucher).toLocaleString("id-ID")
                  : ""
              }
              onChange={(e) =>
                setField("kuotaVoucher", e.target.value.replace(/\D/g, ""))
              }
              errorMessage={formErrors.kuotaVoucher}
              disabled={isDetail}
              readOnly={isDetail}
            />
          </FormContainer>
          <FormContainer>
            <FormLabel required>Kuota per User</FormLabel>
            <Input
              placeholder="Masukkan Kuota per User"
              value={
                formValues.kuotaPerUser
                  ? Number(formValues.kuotaPerUser).toLocaleString("id-ID")
                  : ""
              }
              onChange={(e) =>
                setField("kuotaPerUser", e.target.value.replace(/\D/g, ""))
              }
              errorMessage={formErrors.kuotaPerUser}
              disabled={isDetail}
              readOnly={isDetail}
            />
          </FormContainer>
          <FormContainer>
            <FormLabel required>Metode & Instansi Tujuan Pembayaran</FormLabel>
            <MultiSelectDropdown
              options={paymentMethodOptions}
              selectedItems={formValues.metodeInstansiTujuanPembayaran}
              placeholder="Pilih Metode & Instansi Tujuan Pembayaran"
              onSelectionChange={(selectedMethods) =>
                setField("metodeInstansiTujuanPembayaran", selectedMethods)
              }
              titleModal="Metode & Instansi Tujuan Pembayaran"
              errorMessage={formErrors.metodeInstansiTujuanPembayaran}
              showAllOption={true}
              disabled={isDetail}
            />
          </FormContainer>
          <FormContainer className="items-center">
            <FormLabel required>Status</FormLabel>
            <div className="flex gap-4">
              <RadioButton
                name="status"
                label="Aktif"
                value="Aktif"
                checked={formValues.status === "Aktif"}
                onChange={(e) => setField("status", e.target.value)}
                disabled={isDetail}
              />
              <RadioButton
                name="status"
                label="Tidak Aktif"
                value="Tidak Aktif"
                checked={formValues.status === "Tidak Aktif"}
                onChange={(e) => setField("status", e.target.value)}
                disabled={isDetail}
              />
            </div>
          </FormContainer>
        </div>
      </div>
      <div className="pt-6">
        <h3 className="mb-4 font-bold text-gray-900">Rute Promo</h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <FormContainer>
            <FormLabel required>Lokasi Muat</FormLabel>
            <LocationSelector
              placeholder="Pilih Kota/Kabupaten"
              selectedLocations={formValues.lokasiMuat}
              onSelectionChange={(locations) =>
                setField("lokasiMuat", locations)
              }
              errorMessage={formErrors.lokasiMuat}
              disabled={isDetail}
            />
          </FormContainer>
          <FormContainer>
            <FormLabel required>Lokasi Bongkar</FormLabel>
            <LocationSelector
              placeholder="Pilih Kota/Kabupaten"
              selectedLocations={formValues.lokasiBongkar}
              onSelectionChange={(locations) =>
                setField("lokasiBongkar", locations)
              }
              errorMessage={formErrors.lokasiBongkar}
              disabled={isDetail}
            />
          </FormContainer>
        </div>
        <div className="mt-6">
          <FormContainer className="items-center !gap-y-0">
            <FormLabel>Berlaku Rute Sebaliknya</FormLabel>
            <Checkbox
              checked={formValues.berlakuRuteSebaliknya}
              onChange={({ checked }) =>
                setField("berlakuRuteSebaliknya", checked)
              }
              disabled={isDetail}
            />
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default VoucherForm;
