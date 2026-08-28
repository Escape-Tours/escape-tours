export const calculateBooking = (
    basePrice: number,
    checkIn: string,
    checkOut: string,
    roomType: string
) => {
    // UTC-Normalized: Ensures Tanzania dates don't shift by 1 day
    const d1 = new Date(checkIn + 'T00:00:00Z');
    const d2 = new Date(checkOut + 'T00:00:00Z');
    const nights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));

    // Room type pricing logic
    const modifier = roomType === "Suite" ? 2.5 : roomType === "Double Room" ? 1.5 : 1.0;

    // Financial Precision: Rounded to 2 decimal places
    const subtotal = nights * (basePrice * modifier);
    const total = Math.round((subtotal * 1.01) * 100) / 100;

    return { nights, total };
};