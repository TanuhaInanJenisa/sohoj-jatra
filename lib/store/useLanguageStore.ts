import { create } from "zustand";

export type Language = "en" | "bn";

export interface Translations {
  appName: string;
  tagline: string;
  navHome: string;
  navPOS: string;
  navOperator: string;
  navAdmin: string;
  navPassenger: string;
  roleLabel: string;
  terminalOnline: string;
  terminalOffline: string;
  deckLower: string;
  deckUpper: string;
  deckTitle: string;
  driverCockpit: string;
  doorEntry: string;
  available: string;
  selectedYou: string;
  lockedOther: string;
  booked: string;
  passengerDetails: string;
  passengerName: string;
  mobileNumber: string;
  gender: string;
  male: string;
  female: string;
  nidPassport: string;
  boardingPoint: string;
  droppingPoint: string;
  paymentMethod: string;
  cash: string;
  cashTendered: string;
  changeReturn: string;
  promoCode: string;
  apply: string;
  selectedSeats: string;
  baseFare: string;
  serviceFee: string;
  discount: string;
  totalPayable: string;
  confirmPrint: string;
  clearSelection: string;
  liveLockHold: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    appName: "Sohoj Jatra",
    tagline: "Enterprise Cloud Bus Ticketing & Counter SaaS",
    navHome: "Home",
    navPOS: "Counter POS",
    navOperator: "Operator Portal",
    navAdmin: "Super Admin",
    navPassenger: "Passenger Pass",
    roleLabel: "Role",
    terminalOnline: "Live Cloud Sync",
    terminalOffline: "Offline Cache Mode",
    deckLower: "Lower Deck",
    deckUpper: "Upper Deck",
    deckTitle: "Seating Deck",
    driverCockpit: "DRIVER",
    doorEntry: "ENTRY",
    available: "Available",
    selectedYou: "Selected (You)",
    lockedOther: "Locked (Other Counter)",
    booked: "Booked",
    passengerDetails: "Passenger Details",
    passengerName: "Passenger Full Name",
    mobileNumber: "Mobile Number (BD)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    nidPassport: "NID / Passport (Optional)",
    boardingPoint: "Boarding Counter",
    droppingPoint: "Dropping Stoppage",
    paymentMethod: "Payment Method",
    cash: "Cash",
    cashTendered: "Cash Tendered / Received",
    changeReturn: "Change To Return",
    promoCode: "Promo / Discount Code",
    apply: "Apply",
    selectedSeats: "Selected Seats",
    baseFare: "Base Ticket Fare",
    serviceFee: "Terminal Service Fee",
    discount: "Promo Discount",
    totalPayable: "Total Net Payable",
    confirmPrint: "Confirm & Print Receipt (F8)",
    clearSelection: "Release / Clear (Esc / F2)",
    liveLockHold: "Live Lock Hold",
  },
  bn: {
    appName: "সহজ যাত্রা",
    tagline: "এন্টারপ্রাইজ ক্লাউড বাস টিকেটিং ও কাউন্টার পিওএস",
    navHome: "হোম",
    navPOS: "কাউন্টার পিওএস",
    navOperator: "অপারেটর পোর্টাল",
    navAdmin: "সুপার অ্যাডমিন",
    navPassenger: "যাত্রী বোর্ডিং পাস",
    roleLabel: "ভূমিকা",
    terminalOnline: "লাইভ ক্লাউড সিঙ্ক",
    terminalOffline: "অফলাইন ক্যাশ মোড",
    deckLower: "নিচ তলা (লোয়ার ডেক)",
    deckUpper: "দোতলা (আপার ডেক)",
    deckTitle: "বাসের আসন বিন্যাস",
    driverCockpit: "ড্রাইভার",
    doorEntry: "দরজা",
    available: "খালি আছে",
    selectedYou: "আপনার নির্বাচিত",
    lockedOther: "অন্য কাউন্টারে লকড",
    booked: "বুকড / বিক্রি",
    passengerDetails: "যাত্রীর তথ্যাবলী",
    passengerName: "যাত্রীর পূর্ণ নাম",
    mobileNumber: "মোবাইল নম্বর",
    gender: "লিঙ্গ",
    male: "পুরুষ",
    female: "মহিলা",
    nidPassport: "জাতীয় পরিচয়পত্র / পাসপোর্ট",
    boardingPoint: "বোর্ডিং কাউন্টার",
    droppingPoint: "গন্তব্য স্টপেজ",
    paymentMethod: "মূল্য পরিশোধের মাধ্যম",
    cash: "নগদ টাকা (ক্যাশ)",
    cashTendered: "কাউন্টারে জমা প্রাপ্ত ক্যাশ",
    changeReturn: "ফেরত দেওয়ার অবশিষ্ট টাকা",
    promoCode: "ডিসকাউন্ট / প্রোমো কোড",
    apply: "প্রয়োগ করুন",
    selectedSeats: "নির্বাচিত আসন",
    baseFare: "মূল টিকেট ভাড়া",
    serviceFee: "টার্মিনাল সার্ভিস চার্জ",
    discount: "প্রোমো ডিসকাউন্ট",
    totalPayable: "সর্বমোট প্রদেয় ভাড়া",
    confirmPrint: "টিকেট নিশ্চিত ও প্রিন্ট (F8)",
    clearSelection: "বাতিল / নতুন সিট (Esc / F2)",
    liveLockHold: "লাইভ সিট লক সময়",
  },
};

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations) => string;
  formatDigits: (input: string | number) => string;
}

const bnDigits: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "bn", // Default to Bengali as requested
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === "en" ? "bn" : "en" })),
  t: (key) => DICTIONARY[get().language][key] || DICTIONARY.en[key] || "",
  formatDigits: (input) => {
    const str = String(input);
    if (get().language !== "bn") return str;
    return str.replace(/[0-9]/g, (w) => bnDigits[w] || w);
  },
}));
