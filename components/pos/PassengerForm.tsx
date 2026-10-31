"use client";

import React from "react";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { useLanguageStore } from "@/lib/store/useLanguageStore";
import { PaymentMethod } from "@/types";
import { User, Phone, CreditCard, Tag, Landmark, Wallet, Banknote, MapPin } from "lucide-react";
import { formatCurrencyBDT } from "@/lib/utils";

export const PassengerForm: React.FC = () => {
  const {
    passengerName,
    passengerPhone,
    passengerGender,
    passengerNid,
    boardingPoint,
    droppingPoint,
    droppingFareOffset,
    paymentMethod,
    cashReceived,
    promoCode,
    discountAmount,
    selectedSeatNumbers,
    currentTrip,
    serviceFee,
    setPassengerDetails,
    setDroppingPointWithOffset,
    applyPromoCode,
  } = usePOSStore();

  const { t, formatDigits, language } = useLanguageStore();

  // Waypoint stoppages with fare offset adjustments
  const availableStoppages = [
    { name: "Kolatoli Beach Point (Cox's Bazar)", offset: 0, label: "Cox's Bazar (Full Route)" },
    { name: "Chittagong Dampara Bypass", offset: -400, label: "Chittagong Bypass (-৳400)" },
    { name: "Comilla Cantonment Gate", offset: -600, label: "Comilla Cantonment (-৳600)" },
    { name: "Feni Highway Bypass", offset: -500, label: "Feni Bypass (-৳500)" },
  ];

  const totalSeats = selectedSeatNumbers.length;
  const effectiveBase = Math.max(200, currentTrip.base_fare + droppingFareOffset);
  const totalBase = totalSeats * effectiveBase;
  const netPayable = Math.max(0, totalBase - discountAmount + (totalSeats > 0 ? serviceFee : 0));
  const changeToReturn = Math.max(0, cashReceived - netPayable);

  const [promoInput, setPromoInput] = React.useState("");
  const [promoFeedback, setPromoFeedback] = React.useState<string | null>(null);

  const handleApplyPromo = () => {
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res.message);
  };

  const paymentOptions: Array<{ id: PaymentMethod; label: string; icon: any }> = [
    { id: "cash", label: t("cash"), icon: Banknote },
    { id: "bkash", label: "bKash", icon: Wallet },
    { id: "nagad", label: "Nagad", icon: Landmark },
    { id: "card", label: "Card/POS", icon: CreditCard },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-600" />
          <span>{t("passengerDetails")} (F4)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === "bn"
            ? "টিকেট ও এসএমএস বোর্ডিং পাস প্রেরণের জন্য যাত্রীর তথ্য দিন।"
            : "Enter passenger credentials for ticket issuance & SMS boarding pass."}
        </p>
      </div>

      {/* Name and Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t("passengerName")} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="passenger-name-input"
              type="text"
              placeholder={language === "bn" ? "যেমন: তানভীর আহমেদ" : "e.g. Tanvir Ahmed"}
              value={passengerName}
              onChange={(e) => setPassengerDetails({ passengerName: e.target.value })}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t("mobileNumber")} *
          </label>
          <div className="relative">
            <span className="text-xs font-bold text-slate-400 absolute left-3 top-2.5">+88</span>
            <input
              type="tel"
              placeholder="01712345678"
              value={passengerPhone}
              onChange={(e) => setPassengerDetails({ passengerPhone: e.target.value })}
              className="w-full text-xs pl-11 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Gender & NID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t("gender")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPassengerDetails({ passengerGender: "Male" })}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                passengerGender === "Male"
                  ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              {t("male")} (M)
            </button>
            <button
              type="button"
              onClick={() => setPassengerDetails({ passengerGender: "Female" })}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                passengerGender === "Female"
                  ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              {t("female")} (F)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t("nidPassport")}
          </label>
          <input
            type="text"
            placeholder="10 / 17 digit NID"
            value={passengerNid}
            onChange={(e) => setPassengerDetails({ passengerNid: e.target.value })}
            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 font-medium"
          />
        </div>
      </div>

      {/* Boarding Counter & Dropping Stoppage with Fare Calculation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t("boardingPoint")}
          </label>
          <select
            value={boardingPoint}
            onChange={(e) => setPassengerDetails({ boardingPoint: e.target.value })}
            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 font-medium"
          >
            <option value="Rajarbagh Central Terminal">Rajarbagh Central Terminal (Dhaka)</option>
            <option value="Sayedabad Counter #04">Sayedabad Counter #04 (Dhaka)</option>
            <option value="Gabtoli Bus Terminal">Gabtoli Bus Terminal (Dhaka)</option>
            <option value="Kolatoli Beach Counter">Kolatoli Beach Counter (Cox's Bazar)</option>
            <option value="Dampara Main Counter">Dampara Main Counter (Chittagong)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>{t("droppingPoint")}</span>
            <span className="text-[10px] text-brand-600 font-bold">Waypoint Fare</span>
          </label>
          <select
            value={droppingPoint}
            onChange={(e) => {
              const sel = availableStoppages.find((s) => s.name === e.target.value) || availableStoppages[0];
              setDroppingPointWithOffset(sel.name, sel.offset);
            }}
            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 font-medium"
          >
            {availableStoppages.map((st, i) => (
              <option key={i} value={st.name}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {t("paymentMethod")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {paymentOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = paymentMethod === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPassengerDetails({ paymentMethod: opt.id })}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-brand-600 bg-brand-50/70 text-brand-900 dark:bg-brand-950 dark:text-brand-300 ring-2 ring-brand-500/30"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cash Tendered Calculator (if Cash selected) */}
      {paymentMethod === "cash" && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t("cashTendered")}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {language === "bn" ? "প্রদেয়:" : "Due:"} {formatDigits(formatCurrencyBDT(netPayable))}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">৳</span>
              <input
                type="number"
                placeholder="0"
                value={cashReceived || ""}
                onChange={(e) => setPassengerDetails({ cashReceived: parseFloat(e.target.value) || 0 })}
                className="w-full text-sm pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            {[500, 1000, 2000, 5000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPassengerDetails({ cashReceived: val })}
                className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                ৳{formatDigits(val)}
              </button>
            ))}
          </div>
          {cashReceived > 0 && (
            <div className="flex items-center justify-between pt-1 text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-400">{t("changeReturn")}:</span>
              <span className={`text-sm ${cashReceived >= netPayable ? "text-emerald-600" : "text-rose-500"}`}>
                {cashReceived >= netPayable ? formatDigits(formatCurrencyBDT(changeToReturn)) : `বাকি: ${formatDigits(formatCurrencyBDT(netPayable - cashReceived))}`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Promo Code Input */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {t("promoCode")}
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="e.g. EID2026 or SOHOJ50"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyPromo}
            className="text-xs font-bold px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            {t("apply")}
          </button>
        </div>
        {promoFeedback && (
          <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold mt-1">
            {promoFeedback}
          </p>
        )}
      </div>
    </div>
  );
};
