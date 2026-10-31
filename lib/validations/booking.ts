import { z } from "zod";

// Bangladeshi phone regex: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
export const bangladeshPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

export const passengerBookingSchema = z.object({
  passenger_name: z
    .string()
    .min(2, { message: "Passenger name must be at least 2 characters" })
    .max(100, { message: "Name is too long" }),
  passenger_phone: z
    .string()
    .regex(bangladeshPhoneRegex, { message: "Enter a valid Bangladeshi mobile number (e.g. 01712345678)" }),
  passenger_gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select gender" }),
  }),
  passenger_nid: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 10 || val.length === 13 || val.length === 17, {
      message: "NID must be 10, 13, or 17 digits",
    }),
  boarding_counter_name: z.string().min(1, { message: "Please select a boarding point" }),
  dropping_point: z.string().optional(),
  payment_method: z.enum(["cash", "bkash", "nagad", "sslcommerz", "card"]),
  cash_received: z.number().optional(),
  discount_code: z.string().optional(),
});

export type PassengerBookingFormValues = z.infer<typeof passengerBookingSchema>;

export const operatorOnboardingSchema = z.object({
  company_name: z
    .string()
    .min(3, { message: "Company name must be at least 3 characters" })
    .max(150),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" }),
  contact_email: z.string().email({ message: "Invalid email address" }),
  contact_phone: z.string().regex(bangladeshPhoneRegex, { message: "Enter valid Bangladeshi phone number" }),
  trade_license: z.string().min(5, { message: "Trade License number is required" }),
  address: z.string().min(5, { message: "Head office address is required" }),
  subscription_tier: z.enum(["starter", "professional", "enterprise"]),
  total_fleet_size: z.number().min(1, { message: "Minimum 1 bus required" }),
});

export type OperatorOnboardingFormValues = z.infer<typeof operatorOnboardingSchema>;
