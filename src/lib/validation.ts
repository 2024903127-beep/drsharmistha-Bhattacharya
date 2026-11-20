import { z } from "zod";

export const phoneRe = /^(?:(?:\+?91|0)?[6-9]\d{9}|\+\d{8,15})$/;
const phone = z.string().trim().transform((v) => v.replace(/[\s-]/g, "")).pipe(z.string().regex(phoneRe, "Enter a valid phone number"));
const email = z.union([z.literal(""), z.email("Enter a valid email")]).optional();

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone,
  email,
  service: z.string().trim().min(2, "Choose a procedure"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
  message: z.string().max(1000).optional(),
  website_hp: z.string().max(0).optional(), // honeypot, must stay empty
  attribution: z.record(z.string(), z.string()).optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  phone,
  email,
  service: z.string().optional(),
  message: z.string().max(1000).optional(),
  website_hp: z.string().max(0).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
});
