"use client";

import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useGetRouteList } from "@/services/masterpricing/masterrute/getRouteList";
import { useGetCarrierTypeCalculation } from "@/services/masterpricing/setting-formula-pricing/getCarrierTypeCalculation";
import { useGetTruckTypeCalculation } from "@/services/masterpricing/setting-formula-pricing/getTruckTypeCalculation";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import Select from "@/components/Select";

import { getJarakMinimum } from "./utils";

/**
 * SimulationModal - Modal for inputting simulation data for 4PL formula
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Function to close modal
 * @param {function} props.onCalculate - Function called when "Hitung Harga" is clicked
 * @param {Array} props.formula - The formula to calculate (with variable IDs)
 * @param {Array} props.variables - Dynamic variables from backend
 */
const SimulationModal = ({
  isOpen,
  onClose,
  onCalculate,
  formula = [],
  variables = [],
  formulaId = " ", // Added formulaId prop
}) => {
  const [formData, setFormData] = useState({
    jarak: "",
    rute: "",
    jenisTruk: "",
    jenisCarrier: "",
    tonase: 2.5,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [variableValues, setVariableValues] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    data: ruteOptions,
    mutate: refetchRouteList,
    isLoading: isLoadingRoutes,
    error: routeError,
  } = useGetRouteList();

  // Hook to get truck types based on selected route and formula
  const {
    data: truckTypeData,
    isLoading: isLoadingTruckTypes,
    error: truckTypeError,
    mutate: refetchTruckTypes,
  } = useGetTruckTypeCalculation(formulaId, formData.rute);

  // Hook to get carrier types based on selected truck type
  const {
    data: carrierTypeData,
    isLoading: isLoadingCarrierTypes,
    error: carrierTypeError,
    mutate: refetchCarrierTypes,
  } = useGetCarrierTypeCalculation(formData.jenisTruk);

  const [routeOptions, setRouteOptions] = useState([]);
  const [truckOptions, setTruckOptions] = useState([]);
  const [carrierOptions, setCarrierOptions] = useState([]);

  useEffect(() => {
    console.log("routeOptions", ruteOptions);
    if (ruteOptions?.data) {
      setRouteOptions(
        ruteOptions.data.Data.map((rute) => ({
          id: rute.id,
          alias: rute.alias,
          value: rute.id,
          label: rute.alias,
        }))
      );
      console.log("routeOptions", ruteOptions);
    }
  }, [ruteOptions]);

  // Update truck options when truck type data changes
  useEffect(() => {
    console.log("truckTypeData", truckTypeData);
    if (truckTypeData?.Data) {
      setTruckOptions(
        truckTypeData.Data.map((truck) => ({
          value: truck.truckTypeId,
          label: truck.truckTypeName,
        }))
      );
    } else {
      // Fallback to default truck options when no data
      setTruckOptions([
        { value: "pickup", label: "Pickup" },
        { value: "cdd", label: "CDD" },
        { value: "cde", label: "CDE" },
        { value: "truck", label: "Truck" },
        { value: "tronton", label: "Tronton" },
        { value: "trailer", label: "Trailer" },
      ]);
    }
  }, [truckTypeData]);

  // Update carrier options when carrier type data changes
  useEffect(() => {
    console.log("carrierTypeData", carrierTypeData);
    if (carrierTypeData?.Data) {
      setCarrierOptions(
        carrierTypeData.Data.map((carrier) => ({
          value: carrier.carrierId,
          label: carrier.carrierName,
          maxWeightTon: carrier.maxWeightTon,
        }))
      );
    } else {
      // Fallback to default carrier options when no data
      setCarrierOptions([
        { value: "bak-terbuka", label: "Bak Terbuka" },
        { value: "engkel", label: "Engkel Box" },
        { value: "cdd-box", label: "CDD Box" },
        { value: "cde-box", label: "CDE Box" },
        { value: "truck-box", label: "Truck Box" },
        { value: "container", label: "Container" },
        { value: "tanki", label: "Tanki" },
      ]);
    }
  }, [carrierTypeData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset jenisTruk when rute changes to force reselection
      ...(field === "rute" && { jenisTruk: "", jenisCarrier: "" }),
      // Reset jenisCarrier when jenisTruk changes to force reselection
      ...(field === "jenisTruk" && { jenisCarrier: "" }),
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Mock API call to fetch variable values
  const fetchVariableValues = async (rute, jenisTruk) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock backend response structure
        const mockResponse = {
          jarakMinimum: 100,
          basePrice: [
            {
              typePricingId: "749d58ea-eb6a-45b4-a19f-9da61aeead67",
              typePricingName: "Medium",
              variables: {
                enam: {
                  id: "34b44f3d-d265-4c2b-a284-565bc94f11d2",
                  value: 1000,
                  isFromShipper: false,
                },
                jarak: {
                  id: "2ccb11f1-2265-4361-b769-55d773928760",
                  value: null,
                  isFromShipper: true,
                },
                PL: {
                  id: "f979e389-2930-4bf0-b790-badb7bb21d70",
                  value: 5200,
                  isFromShipper: false,
                },
                tonase: {
                  id: "070e3ff1-bdd1-4e2a-a46b-d1c2044327e2",
                  value: null,
                  isFromShipper: true,
                },
              },
            },
            {
              typePricingId: "bef711a6-7a1c-4625-a129-ed933f38ce9e",
              typePricingName: "High",
              variables: {
                enam: {
                  id: "34b44f3d-d265-4c2b-a284-565bc94f11d2",
                  value: 6000,
                  isFromShipper: false,
                },
                jarak: {
                  id: "2ccb11f1-2265-4361-b769-55d773928760",
                  value: null,
                  isFromShipper: true,
                },
                PL: {
                  id: "f979e389-2930-4bf0-b790-badb7bb21d70",
                  value: 1500,
                  isFromShipper: false,
                },
                tonase: {
                  id: "070e3ff1-bdd1-4e2a-a46b-d1c2044327e2",
                  value: null,
                  isFromShipper: true,
                },
              },
            },
            {
              typePricingId: "67ff9e7e-d3cb-48fe-8a1e-3b492915ce54",
              typePricingName: "Low edit",
              variables: {
                enam: {
                  id: "34b44f3d-d265-4c2b-a284-565bc94f11d2",
                  value: 4000,
                  isFromShipper: false,
                },
                jarak: {
                  id: "2ccb11f1-2265-4361-b769-55d773928760",
                  value: null,
                  isFromShipper: true,
                },
                PL: {
                  id: "f979e389-2930-4bf0-b790-badb7bb21d70",
                  value: 800,
                  isFromShipper: false,
                },
                tonase: {
                  id: "070e3ff1-bdd1-4e2a-a46b-d1c2044327e2",
                  value: null,
                  isFromShipper: true,
                },
              },
            },
            {
              typePricingId: "1346450a-ea1d-4f7f-8604-3a9d4f7605fe",
              typePricingName: "Higaah",
              variables: {
                enam: {
                  id: "34b44f3d-d265-4c2b-a284-565bc94f11d2",
                  value: 7000,
                  isFromShipper: false,
                },
                jarak: {
                  id: "2ccb11f1-2265-4361-b769-55d773928760",
                  value: null,
                  isFromShipper: true,
                },
                PL: {
                  id: "f979e389-2930-4bf0-b790-badb7bb21d70",
                  value: 2000,
                  isFromShipper: false,
                },
                tonase: {
                  id: "070e3ff1-bdd1-4e2a-a46b-d1c2044327e2",
                  value: null,
                  isFromShipper: true,
                },
              },
            },
          ],
        };

        resolve(mockResponse);
      }, 1000);
    });
  };

  // Calculate formula result for each pricing type
  const calculateFormula = (
    basePriceData,
    formula,
    finalJarak,
    finalTonase
  ) => {
    if (!formula || formula.length === 0) {
      console.warn("No formula provided, using fallback calculation");
      return getFallbackCalculation({});
    }

    const results = {};

    try {
      // Calculate for each pricing type
      basePriceData.forEach((priceType) => {
        console.log(`Calculating for ${priceType.typePricingName}:`, priceType);

        // Create variable values for this pricing type
        const variableValues = {};

        Object.entries(priceType.variables).forEach(([varName, varData]) => {
          if (varData.isFromShipper) {
            // Use form data for shipper variables
            if (varName === "jarak") {
              variableValues[varData.id] = finalJarak;
            } else if (varName === "tonase") {
              variableValues[varData.id] = finalTonase;
            }
          } else {
            // Use backend value for non-shipper variables
            variableValues[varData.id] = varData.value;
          }
        });

        console.log(
          `Variables for ${priceType.typePricingName}:`,
          variableValues
        );

        // Convert the formula array to a mathematical expression
        const formulaExpression = convertFormulaToExpression(
          formula,
          variableValues
        );
        console.log(
          `Formula expression for ${priceType.typePricingName}:`,
          formulaExpression
        );

        // Evaluate the formula
        const calculatedResult = evaluateFormula(formulaExpression);
        console.log(
          `Result for ${priceType.typePricingName}:`,
          calculatedResult
        );

        if (!isNaN(calculatedResult) && calculatedResult > 0) {
          // Map pricing type names to result keys
          const pricingTypeMap = {
            Low: "low",
            "Low edit": "low", // Handle variations in naming
            Medium: "medium",
            High: "high",
            Higaah: "high", // Handle variations in naming
          };

          const resultKey =
            pricingTypeMap[priceType.typePricingName] ||
            priceType.typePricingName.toLowerCase();

          results[resultKey] = Math.round(calculatedResult);
        }
      });

      // Ensure we have all required pricing tiers with fallbacks
      const finalResults = {
        low: results.low || results["low edit"] || 0,
        medium: results.medium || 0,
        high: results.high || results.higaah || 0,
        lowSpecial: results.low ? Math.round(results.low * 0.8) : 0,
      };

      console.log("Final calculated results:", finalResults);
      return finalResults;
    } catch (error) {
      console.error("Error calculating formula:", error);
      console.warn("Using fallback calculation due to error");
      return getFallbackCalculation({});
    }
  };

  // Convert formula array to mathematical expression string
  const convertFormulaToExpression = (formula, variableValues) => {
    console.log("formula", formula);
    console.log("variableValues", variableValues);
    return formula
      .map((item) => {
        // Check if the item is a variable ID that exists in our variableValues
        if (Object.prototype.hasOwnProperty.call(variableValues, item)) {
          return variableValues[item];
        }

        // Map operator symbols to JavaScript operators (for display operators in formula)
        const operatorMap = {
          "×": "*",
          "÷": "/",
          "^": "**", // JavaScript exponentiation operator
        };

        // Return mapped operator or the item as-is (for basic operators and numbers)
        return operatorMap[item] || item;
      })
      .join(" ");
  };

  // Safe formula evaluation using Function constructor
  const evaluateFormula = (expression) => {
    // Basic safety check - only allow numbers, basic operators, and parentheses
    const safePattern = /^[\d\s+\-*/().]+$/;
    if (!safePattern.test(expression)) {
      throw new Error("Formula contains unsafe characters");
    }

    // Use Function constructor for safer evaluation than eval
    const func = new Function(`return ${expression}`);
    const result = func();

    if (!isFinite(result)) {
      throw new Error("Formula evaluation resulted in infinite or NaN value");
    }

    return result;
  };

  // Fallback calculation when formula evaluation fails
  const getFallbackCalculation = (variableValues) => {
    const basePrice = 800000;
    const jarakMultiplier = variableValues.jarak || 0;
    const tonaseMultiplier = variableValues.tonase || 1;
    const calculatedBase =
      basePrice + jarakMultiplier * 1000 + tonaseMultiplier * 50000;

    return {
      low: Math.round(calculatedBase),
      medium: Math.round(calculatedBase),
      high: Math.round(calculatedBase * 1.25),
      lowSpecial: Math.round(calculatedBase * 0.8),
    };
  };

  const handleCalculate = async () => {
    // Reset previous validation errors
    setValidationErrors({});

    // Validate required fields
    const errors = {};

    if (!formData.jarak || formData.jarak.trim() === "") {
      errors.jarak = "Jarak wajib diisi";
    }

    if (!formData.rute) {
      errors.rute = "Rute wajib diisi";
    }

    if (!formData.jenisTruk) {
      errors.jenisTruk = "Jenis Truk wajib diisi";
    }

    if (!formData.jenisCarrier) {
      errors.jenisCarrier = "Jenis Carrier wajib diisi";
    }

    if (!formData.tonase || parseFloat(formData.tonase) <= 0) {
      errors.tonase = "Tonase wajib diisi";
    }

    // Check if routes are still loading
    if (isLoadingRoutes) {
      errors.rute = "Menunggu data rute dimuat...";
    }

    // Check if there was an error loading routes
    if (routeError) {
      errors.rute = "Gagal memuat data rute. Silakan refresh halaman.";
    }

    // Check if truck types are still loading
    if (isLoadingTruckTypes && formData.rute) {
      errors.jenisTruk = "Menunggu data jenis truk dimuat...";
    }

    // Check if there was an error loading truck types
    if (truckTypeError) {
      errors.jenisTruk = "Gagal memuat jenis truk. Silakan refresh halaman.";
    }

    // Check if carrier types are still loading
    if (isLoadingCarrierTypes && formData.jenisTruk) {
      errors.jenisCarrier = "Menunggu data jenis carrier dimuat...";
    }

    // Check if there was an error loading carrier types
    if (carrierTypeError) {
      errors.jenisCarrier =
        "Gagal memuat jenis carrier. Silakan refresh halaman.";
    }

    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsCalculating(true);

    try {
      // Step 1: Fetch variable values from API
      const apiResponse = await fetchVariableValues(
        formData.rute,
        formData.jenisTruk
      );

      console.log("Step 1", apiResponse);

      // Step 2: Apply jarak minimum logic
      const finalJarak = getJarakMinimum(
        formData.jarak,
        apiResponse.jarakMinimum
      );

      console.log("Step 2", finalJarak);

      // Step 3: Get final tonase
      const finalTonase = parseFloat(formData.tonase);

      console.log("Step 3", finalTonase);

      // Step 4: Calculate using formula with base price data
      const results = calculateFormula(
        apiResponse.basePrice,
        formula,
        finalJarak,
        finalTonase
      );

      // Step 5: Create variable values for display (using first pricing type as reference)
      const displayVariables = {};
      if (apiResponse.basePrice && apiResponse.basePrice.length > 0) {
        const firstPriceType = apiResponse.basePrice[0];
        Object.entries(firstPriceType.variables).forEach(
          ([varName, varData]) => {
            if (varData.isFromShipper) {
              if (varName === "jarak") {
                displayVariables[varName] = finalJarak;
              } else if (varName === "tonase") {
                displayVariables[varName] = finalTonase;
              }
            } else {
              displayVariables[varName] = varData.value;
            }
          }
        );
      }

      console.log("Step 5", displayVariables);

      setVariableValues(displayVariables);
      setCalculationResults(results);

      // Call parent callback if provided
      onCalculate?.(formData, formula, results);
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Error during calculation");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setCalculationResults(null);
    setVariableValues(null);
    setFormData({
      jarak: "",
      rute: "",
      jenisTruk: "",
      jenisCarrier: "",
      tonase: 2.5,
    });
  };

  const handleClose = () => {
    // Clear all form data and calculation results when modal closes
    setCalculationResults(null);
    setVariableValues(null);
    setValidationErrors({});
    setFormData({
      jarak: "",
      rute: "",
      jenisTruk: "",
      jenisCarrier: "",
      tonase: 2.5,
    });
    setIsCalculating(false);

    // Call the original onClose callback
    onClose();
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to convert formula with IDs to display formula with variable names
  const convertFormulaToDisplayString = (formula, variables) => {
    return formula
      .map((item) => {
        // Check if the item is a variable ID
        const variable = variables.find((v) => v.id === item);
        if (variable) {
          return variable.variableName;
        }
        // Return the item as-is for operators and numbers
        return item;
      })
      .join(" ");
  };

  // Refetch route list when modal opens
  useEffect(() => {
    if (isOpen) {
      refetchRouteList();
    }
  }, [isOpen, refetchRouteList]);

  useEffect(() => {
    console.log("formula", formula);
  }, [formula]);
  if (!isOpen) return null;

  // Get the label for selected options
  const getSelectedLabel = (options, value) => {
    const selected = options.find((option) => option.value === value);
    return selected ? selected.label : value;
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent
        size="medium"
        type="muattrans"
        className={`w-full max-w-[500px]`}
        withCloseButton={true}
        closeOnOutsideClick={true}
        appearance={{
          closeButtonClassname: "size-3 text-black",
        }}
      >
        {/* Modal Content */}
        <div className={`flex w-full flex-col items-center gap-5 px-2 py-8`}>
          {/* Title */}
          <div className="flex flex-col items-center justify-center">
            <ModalTitle>Masukkan Data Simulasi Rumus 4PL</ModalTitle>
          </div>

          {/* Form Fields */}
          <div className="flex w-full flex-col gap-[10px] px-5">
            {/* Jarak Field */}
            <div className="flex items-center gap-[25px]">
              <label className="w-[140px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                Jarak*
              </label>
              <div className="flex-1">
                <Input
                  placeholder="Masukkan Nilai Jarak"
                  value={formData.jarak}
                  onChange={(e) => handleInputChange("jarak", e.target.value)}
                  className={`w-full ${validationErrors.jarak ? "border-red-500" : ""}`}
                />
                {validationErrors.jarak && (
                  <div className="mt-1 text-sm text-red-600">
                    {validationErrors.jarak}
                  </div>
                )}
              </div>
            </div>

            {/* Rute Field */}
            <div className="flex items-center gap-[25px]">
              <label className="w-[140px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                Rute*
              </label>
              <div className="flex-1">
                <Select.Root
                  value={formData.rute}
                  onValueChange={(value) => handleInputChange("rute", value)}
                  disabled={isLoadingRoutes || !!routeError}
                >
                  <Select.Trigger
                    placeholder={
                      isLoadingRoutes
                        ? "Memuat rute..."
                        : routeError
                          ? "Error memuat rute"
                          : "Pilih Rute"
                    }
                    className={validationErrors.rute ? "border-red-500" : ""}
                  >
                    <Select.Value
                      placeholder={
                        isLoadingRoutes
                          ? "Memuat rute..."
                          : routeError
                            ? "Error memuat rute"
                            : "Pilih Rute"
                      }
                    >
                      {formData.rute
                        ? routeOptions.find(
                            (option) => option.id === formData.rute
                          )?.alias || formData.rute
                        : null}
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Content searchable>
                    {routeOptions && routeOptions.length > 0 ? (
                      routeOptions.map((rute) => (
                        <Select.Item
                          key={rute.id}
                          value={rute.id}
                          textValue={rute.alias}
                          className="px-3 py-3"
                        >
                          <span className="truncate text-xs font-medium text-neutral-900">
                            {rute.alias}
                          </span>
                        </Select.Item>
                      ))
                    ) : (
                      <Select.Empty>No routes available.</Select.Empty>
                    )}
                  </Select.Content>
                </Select.Root>
                {validationErrors.rute && (
                  <div className="mt-1 text-sm text-red-600">
                    {validationErrors.rute}
                  </div>
                )}
                {routeError && (
                  <div className="mt-1 text-sm text-red-600">
                    Gagal memuat data rute. Silakan coba lagi.
                  </div>
                )}
              </div>
            </div>

            {/* Jenis Truk Field */}
            <div className="flex items-center gap-[25px]">
              <label className="w-[140px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                Jenis Truk*
              </label>
              <div className="flex-1">
                <Select.Root
                  value={formData.jenisTruk}
                  onValueChange={(value) =>
                    handleInputChange("jenisTruk", value)
                  }
                  disabled={!formData.rute || isLoadingTruckTypes}
                >
                  <Select.Trigger
                    placeholder={
                      !formData.rute
                        ? "Pilih rute terlebih dahulu"
                        : isLoadingTruckTypes
                          ? "Memuat jenis truk..."
                          : truckTypeError
                            ? "Error memuat jenis truk"
                            : "Pilih Jenis Truk"
                    }
                    className={
                      validationErrors.jenisTruk ? "border-red-500" : ""
                    }
                  >
                    <Select.Value
                      placeholder={
                        !formData.rute
                          ? "Pilih rute terlebih dahulu"
                          : isLoadingTruckTypes
                            ? "Memuat jenis truk..."
                            : truckTypeError
                              ? "Error memuat jenis truk"
                              : "Pilih Jenis Truk"
                      }
                    >
                      {formData.jenisTruk
                        ? truckOptions.find(
                            (option) => option.value === formData.jenisTruk
                          )?.label || formData.jenisTruk
                        : null}
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Content searchable>
                    {truckOptions && truckOptions.length > 0 ? (
                      truckOptions.map((truck) => (
                        <Select.Item
                          key={truck.value}
                          value={truck.value}
                          textValue={truck.label}
                          className="px-3 py-3"
                        >
                          <span className="truncate text-xs font-medium text-neutral-900">
                            {truck.label}
                          </span>
                        </Select.Item>
                      ))
                    ) : (
                      <Select.Empty>
                        {!formData.rute
                          ? "Pilih rute terlebih dahulu"
                          : "Tidak ada jenis truk tersedia"}
                      </Select.Empty>
                    )}
                  </Select.Content>
                </Select.Root>
                {validationErrors.jenisTruk && (
                  <div className="mt-1 text-sm text-red-600">
                    {validationErrors.jenisTruk}
                  </div>
                )}
                {truckTypeError && (
                  <div className="mt-1 text-sm text-red-600">
                    Gagal memuat jenis truk. Silakan coba lagi.
                  </div>
                )}
              </div>
            </div>

            {/* Jenis Carrier Field */}
            <div className="flex items-center gap-[25px]">
              <label className="w-[140px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                Jenis Carrier*
              </label>
              <div className="flex-1">
                <Select.Root
                  value={formData.jenisCarrier}
                  onValueChange={(value) => {
                    handleInputChange("jenisCarrier", value);
                    handleInputChange(
                      "tonase",
                      carrierOptions.find((option) => option.value === value)
                        ?.maxWeightTon
                    );
                  }}
                  disabled={!formData.jenisTruk || isLoadingCarrierTypes}
                >
                  <Select.Trigger
                    placeholder={
                      !formData.jenisTruk
                        ? "Pilih jenis truk terlebih dahulu"
                        : isLoadingCarrierTypes
                          ? "Memuat jenis carrier..."
                          : carrierTypeError
                            ? "Error memuat jenis carrier"
                            : "Pilih Jenis Carrier"
                    }
                    className={
                      validationErrors.jenisCarrier ? "border-red-500" : ""
                    }
                  >
                    <Select.Value
                      placeholder={
                        !formData.jenisTruk
                          ? "Pilih jenis truk terlebih dahulu"
                          : isLoadingCarrierTypes
                            ? "Memuat jenis carrier..."
                            : carrierTypeError
                              ? "Error memuat jenis carrier"
                              : "Pilih Jenis Carrier"
                      }
                    >
                      {formData.jenisCarrier
                        ? carrierOptions.find(
                            (option) => option.value === formData.jenisCarrier
                          )?.label || formData.jenisCarrier
                        : null}
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Content searchable>
                    {carrierOptions && carrierOptions.length > 0 ? (
                      carrierOptions.map((carrier) => (
                        <Select.Item
                          key={carrier.value}
                          value={carrier.value}
                          textValue={carrier.label}
                          className="px-3 py-3"
                        >
                          <span className="truncate text-xs font-medium text-neutral-900">
                            {carrier.label}
                          </span>
                        </Select.Item>
                      ))
                    ) : (
                      <Select.Empty>
                        {!formData.jenisTruk
                          ? "Pilih jenis truk terlebih dahulu"
                          : "Tidak ada jenis carrier tersedia"}
                      </Select.Empty>
                    )}
                  </Select.Content>
                </Select.Root>
                {validationErrors.jenisCarrier && (
                  <div className="mt-1 text-sm text-red-600">
                    {validationErrors.jenisCarrier}
                  </div>
                )}
                {carrierTypeError && (
                  <div className="mt-1 text-sm text-red-600">
                    Gagal memuat jenis carrier. Silakan coba lagi.
                  </div>
                )}
              </div>
            </div>

            {/* Tonase Field */}
            <div className="flex items-center gap-[25px]">
              <label className="w-[140px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                Tonase*
              </label>
              <div className="flex flex-1 items-center gap-[10px]">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={formData.tonase}
                    onChange={(e) =>
                      handleInputChange("tonase", e.target.value)
                    }
                    className={`w-full ${validationErrors.tonase ? "border-red-500" : ""}`}
                    disabled
                  />
                  {validationErrors.tonase && (
                    <div className="mt-1 text-sm text-red-600">
                      {validationErrors.tonase}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium leading-[17px] text-[#1B1B1B]">
                  Ton
                </span>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-3">
            <Button
              variant="muatparts-primary"
              onClick={handleCalculate}
              disabled={
                isCalculating ||
                isLoadingRoutes ||
                isLoadingTruckTypes ||
                isLoadingCarrierTypes
              }
              className="w-[135px] rounded-[20px] px-6 py-2"
            >
              {isCalculating
                ? "Menghitung..."
                : isLoadingRoutes
                  ? "Memuat..."
                  : isLoadingTruckTypes && formData.rute
                    ? "Memuat..."
                    : isLoadingCarrierTypes && formData.jenisTruk
                      ? "Memuat..."
                      : calculationResults
                        ? "Hitung Ulang"
                        : "Hitung Harga"}
            </Button>
          </div>

          {/* Results Section */}
          {calculationResults && (
            <div className="flex w-full flex-col gap-[15px] px-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold leading-[19px] text-[#1B1B1B]">
                  Hasil Perhitungan Harga
                </h3>

                {/* Show the formula that was used */}
                {formula && formula.length > 0 && (
                  <div className="rounded bg-gray-50 p-2">
                    <p className="mb-1 text-xs text-gray-600">
                      Formula yang digunakan:
                    </p>
                    <p className="font-mono text-sm text-gray-800">
                      {convertFormulaToDisplayString(formula, variables)}
                    </p>
                  </div>
                )}

                {/* Show variable values used */}
                {variableValues && (
                  <div className="rounded bg-blue-50 p-2">
                    <p className="mb-1 text-xs text-blue-600">
                      Nilai variabel:
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-xs text-blue-800">
                      {Object.entries(variableValues)
                        .filter(([key]) =>
                          variables.some(
                            (v) => v.variableName === key || v.id === key
                          )
                        )
                        .slice(0, 6) // Show first 6 to avoid clutter
                        .map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-[100px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    Low
                  </span>
                  <span className="text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    : {formatCurrency(calculationResults.low)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-[100px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    Medium
                  </span>
                  <span className="text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    : {formatCurrency(calculationResults.medium)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-[100px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    High
                  </span>
                  <span className="text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    : {formatCurrency(calculationResults.high)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-[100px] text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    Low Special
                  </span>
                  <span className="text-base font-semibold leading-[19px] text-[#1B1B1B]">
                    : {formatCurrency(calculationResults.lowSpecial)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

SimulationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCalculate: PropTypes.func,
  formula: PropTypes.array,
  formulaId: PropTypes.string,
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      variableName: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
};

export default SimulationModal;
