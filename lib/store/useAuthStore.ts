import { create } from "zustand";
import { UserRole, Operator } from "@/types";
import { MOCK_OPERATORS } from "@/lib/supabase/mock-data";

interface AuthState {
  currentRole: UserRole;
  currentOperator: Operator;
  userEmail: string;
  userName: string;
  setRole: (role: UserRole) => void;
  setOperator: (operator: Operator) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentRole: "counter_staff",
  currentOperator: MOCK_OPERATORS[0],
  userEmail: "cashier.rajarbagh@greenlinebd.com",
  userName: "Mohammad Rafiq (Counter Manager)",

  setRole: (role) => {
    let email = "cashier.rajarbagh@greenlinebd.com";
    let name = "Mohammad Rafiq (Counter Manager)";

    if (role === "super_admin") {
      email = "admin@sohojjatra.com";
      name = "Nazmul Hasan (Platform Executive)";
    } else if (role === "operator_admin") {
      email = "fleet.director@greenlinebd.com";
      name = "Haji Alauddin (Director of Operations)";
    } else if (role === "passenger") {
      email = "tanvir.chowdhury@gmail.com";
      name = "Tanvir Ahmed Chowdhury (Passenger)";
    }

    set({ currentRole: role, userEmail: email, userName: name });
  },

  setOperator: (op) => set({ currentOperator: op }),
}));
