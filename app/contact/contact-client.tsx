'use client';
import { useState } from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Youtube, Instagram, Facebook, Music, Map, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WhatsAppFloat from "@/components/whatsapp-float";

const initialForm = { fullName: '', email: '', phone: '', country: '', tripType: '', travel: '', returnDate: '', message: '' };

export default function ContactClientPage() {
    const [formData, setFormData] = useState(initialForm);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData(initialForm);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen w-full p-4 bg-white flex flex-col items-center">
            <main className="flex flex-col md:flex-row w-full max-w-7xl gap-12 mt-10">

                {/* LEFT SIDE: Form OR Success Message */}
                <div className="w-full md:w-1/2">
                    {status === 'success' ? (
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-[500px]">
                            <h2 className="text-3xl font-black mb-4 text-[#d97706]">Inquiry Sent!</h2>
                            <p className="text-lg text-gray-700 mb-6">Thank you for your inquiry. We will contact you within 24 hours.</p>
                            <Button variant="outline" onClick={() => setStatus('idle')}><ArrowLeft className="mr-2 h-4 w-4" /> Send Another</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                            <h2 className="text-3xl font-black mb-6">Plan Your Adventure</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Full Name *" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} value={formData.fullName} required />
                                <Input placeholder="Email *" onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} required />
                                <Input placeholder="Phone" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} />
                                <Input placeholder="Country" onChange={(e) => setFormData({ ...formData, country: e.target.value })} value={formData.country} />

                                <Select value={formData.tripType} onValueChange={(val) => setFormData({ ...formData, tripType: val })}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Type of Trip" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="safari">Safari</SelectItem>
                                        <SelectItem value="trekking">Trekking</SelectItem>
                                        <SelectItem value="beach">Beach Holiday</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input type="date" onChange={(e) => setFormData({ ...formData, travel: e.target.value })} value={formData.travel} />
                                <Input type="date" onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })} value={formData.returnDate} />
                            </div>
                            <Textarea placeholder="How can we help?..." className="mt-4" onChange={(e) => setFormData({ ...formData, message: e.target.value })} value={formData.message} />
                            <Button type="submit" disabled={status === 'sending'} className="w-full mt-4 bg-[#d97706] hover:bg-[#b45309] text-lg h-12">
                                {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
                            </Button>
                        </form>
                    )}
                </div>

                {/* RIGHT SIDE: Trust & Contact Info */}
                <aside className="w-full md:w-1/2 flex flex-col gap-6">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                        <ShieldCheck className="w-12 h-12 text-[#d97706]" />
                        <div>
                            <h3 className="font-bold text-lg">Trusted & Certified</h3>
                            <p className="text-gray-600 text-sm">Fully licensed Tanzanian tour operator.</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                        <Map className="w-12 h-12 text-[#d97706]" />
                        <div>
                            <h3 className="font-bold text-lg">Expert Guides</h3>
                            <p className="text-gray-600 text-sm">Hand-picked, knowledgeable local experts.</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                        <Clock className="w-12 h-12 text-[#d97706]" />
                        <div>
                            <h3 className="font-bold text-lg">24/7 Support</h3>
                            <p className="text-gray-600 text-sm">We're with you every step of the way.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-2 text-gray-700">
                        <div className="flex items-center gap-3"><MapPin className="text-[#d97706]" /> Millenium Towers, Tanzania</div>
                        <div className="flex items-center gap-3"><Phone className="text-[#d97706]" /> +255 666281717</div>
                        <div className="flex items-center gap-3"><Mail className="text-[#d97706]" /> escapetourstz@gmail.com</div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <a href="https://youtube.com/@escapetours2031?si=-KkGBZDNMFDIhFBo" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><Youtube className="w-6 h-6 text-[#d97706]" /></a>
                        <a href="https://www.instagram.com/escapetours_tz?igsh=MWQ5bDZsN2xmZGM2bQ%3D%3D&utm_source=qr" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><Instagram className="w-6 h-6 text-[#d97706]" /></a>
                        <a href="https://www.facebook.com/profile.php?id=61582145671113&mibextid=wwXIfr&mibextid=wwXIfr" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><Facebook className="w-6 h-6 text-[#d97706]" /></a>
                        <a href="https://www.tiktok.com/@escape.tours1?_r=1&_t=ZS-96but75djQ9" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><Music className="w-6 h-6 text-[#d97706]" /></a>
                    </div>
                </aside>
            </main>
            <WhatsAppFloat />
        </div>
    )
}