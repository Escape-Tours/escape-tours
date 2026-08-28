import { z } from "zod";

export const bookingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  countryCode: z.string(),
  phone: z.string().min(7, "Phone number is too short"),
  travelDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Travel date must be in the future",
  }),
  adults: z.coerce.number().min(1, "At least 1 adult required"),
  accommodation: z.enum(["budget", "mid-range", "luxury"]),
  message: z.string().optional(),
});