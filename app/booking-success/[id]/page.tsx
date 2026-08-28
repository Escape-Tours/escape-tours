'use client';
import { LOGO_BASE64 } from '@/lib/logoData';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BookingReceipt({ params }: { params: { id: string } }) {
    const [booking, setBooking] = useState<any>(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        async function getBooking() {
            const supabase = getSupabaseClient();
            
            const { data } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', params.id)
                .single();
                
            if (data) setBooking(data);
        }
        getBooking();
    }, [params.id]);

    const handleDownload = () => {
        if (!booking) return;
        const doc = new jsPDF();
        
        // Add your base64 string between the quotes below
        // 2. Use the imported constant here
        if (LOGO_BASE64) {
            doc.addImage(LOGO_BASE64, 'JPEG', 14, 10, 30, 15);
        }
       
        
        // 3. Company Header
        doc.setFontSize(10);
        doc.text("Escape Tours Tanzania", 14, 30);
        doc.text("Tanzania +255 | Phone: 0666281717", 14, 35);
        doc.text("Email: escapetours@gmail.com", 14, 40);
        
        // 4. Receipt Table
        doc.setFontSize(16);
        doc.text("Official Receipt", 14, 55);
        
        autoTable(doc, {
            startY: 60,
            head: [['Description', 'Details']],
            body: [
            ['Booking ID', booking.id],
            ['Full Name', booking.full_name], // New field
            ['Service', booking.service_name],
            ['Check-in Date', booking.check_in],
            ['Check-out Date', booking.check_out], // New field
            ['Adults', booking.adults || '1'],     // New field (default to 1)
            ['Children', booking.children || '0'], // New field (default to 0)
            ['Total Paid', `${booking.total_amount} ${booking.currency}`],
            ['Status', booking.status.toUpperCase()],
        ],
        });
        
        doc.save(`Receipt_${booking.id}.pdf`);
    };

    const verifyPayment = async () => {
        if (!booking.order_tracking_id) return alert("No tracking ID found.");
        setVerifying(true);
        try {
            const res = await fetch(`/api/verify-payment?orderTrackingId=${booking.order_tracking_id}`);
            const data = await res.json();
            if (data.status === 'Completed') {
                alert("Payment verified successfully!");
                window.location.reload();
            } else {
                alert(`Current Status: ${data.status}`);
            }
        } catch (err) {
            alert("Verification failed.");
        } finally {
            setVerifying(false);
        }
    };

    if (!booking) return <div className="p-10">Loading secure booking details...</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">Booking Confirmed</h1>
            <p className="mt-2 text-gray-600">Reservation: <strong>{booking.service_name}</strong></p>
            
            <div className="my-6 p-4 bg-gray-50 rounded">
                <p><strong>Total:</strong> {booking.total_amount} {booking.currency}</p>
                <p><strong>Status:</strong> {booking.status}</p>
            </div>

            <div className="flex flex-col gap-3">
                <button onClick={handleDownload} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Download PDF Receipt
                </button>
                
                {booking.status !== 'confirmed' && (
                    <button 
                        onClick={verifyPayment} 
                        disabled={verifying}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                    >
                        {verifying ? "Checking..." : "Refresh Payment Status"}
                    </button>
                )}
            </div>
        </div>
    );
}