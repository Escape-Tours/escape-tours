import { ResidencyTier } from "@/lib/utils/price-translator";

export function detectResidencyFromCredentials({
  phoneNumber,
  passportNumber,
}: {
  phoneNumber?: string;
  passportNumber?: string;
}): ResidencyTier {
  // Example logic for Tanzania/East Africa context (+255 or local passport prefixes)
  const cleanPhone = (phoneNumber || "").trim().replace(/\s+/g, "");
  const cleanPassport = (passportNumber || "").trim().toUpperCase();

  // Check phone prefix (e.g., +255 for Tanzania citizen/resident)
  if (cleanPhone.startsWith("+255") || cleanPhone.startsWith("0")) {
    return "CITIZEN";
  }

  // Check passport prefix or regional rules (customize prefix checks as needed)
  if (cleanPassport.startsWith("TZ") || cleanPassport.startsWith("EAT")) {
    return "RESIDENT";
  }

  // Default fallback for international users
  return "INTERNATIONAL";
}