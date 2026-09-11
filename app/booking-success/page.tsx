export default function BookingSuccess() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-slate-950 text-white">
            <h1 className="text-3xl font-bold text-amber-500 mb-4">Booking Confirmed!</h1>
            <p className="text-slate-400">Thank you for securing your stay. We have sent a confirmation email.</p>
            <a href="/" className="mt-8 px-6 py-3 bg-amber-500 text-black font-bold rounded-full">
                Back to Home
            </a>
        </div>
    );
}