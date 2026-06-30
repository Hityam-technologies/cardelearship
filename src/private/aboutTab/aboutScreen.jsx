import React from 'react';
import Header from '../../components/header';
import DealershipMap from '../../components/dealershipMap';
import { getDealershipStats } from '../../data/cars';

const STATS = [
    { value: '15+', label: 'Years' },
    { value: '2.5K', label: 'Cars Sold' },
];

const CONTACT_ITEMS = [
    {
        label: 'Address',
        content: 'Survey No. 19, Kukatpally Housing Board - Hitech City Rd, opposite to Yashoda Hospital, Siddhi Vinayak Nagar, Madhapur, Hyderabad, 500081',
    },
    {
        label: 'Phone',
        content: '+91-9234545678',
        href: 'tel:+919234545678',
    },
    {
        label: 'Email',
        content: 'acncars.in@gmail.com',
        href: 'mailto:acncars.in@gmail.com',
    },
];

const AboutScreen = () => {
    const stats = getDealershipStats();

    return (
        <div className="w-full max-w-full min-h-screen min-h-[100dvh] bg-[#fafafa] p-2 sm:p-4 flex flex-col box-border font-sans">
            <div className="w-full min-h-[calc(100dvh-1rem)] sm:min-h-[calc(100dvh-2rem)] bg-[#111111] rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] relative overflow-hidden flex flex-col isolate">

                <Header />

                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 px-6 sm:px-10 lg:px-16 xl:px-24 pt-[100px] lg:pt-[76px] pb-6 min-h-0 relative z-10 overflow-y-auto lg:overflow-hidden custom-scrollbar">

                    {/* Left — about */}
                    <div className="w-full lg:w-[44%] flex flex-col gap-4 lg:pr-14 xl:pr-20">
                        <div className="text-[#da2525]">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <line x1="12" y1="2" x2="12" y2="22" />
                            </svg>
                        </div>

                        <h1 className="font-michroma text-[28px] sm:text-[34px] lg:text-[36px] leading-[1.15] text-white uppercase m-0">
                            About Us
                        </h1>

                        <div className="w-12 h-px bg-[#da2525]" />

                        <div className="flex flex-col gap-3 max-w-[480px]">
                            <p className="text-white/60 text-[12px] sm:text-[13px] leading-[1.75] m-0">
                                ACN is a premium car dealership based in Hyderabad, built on a simple belief — buying a car should be honest, personal, and stress-free. For over 15 years, we have helped thousands of customers across India find vehicles that truly fit their lifestyle and budget.
                            </p>
                            <p className="text-white/55 text-[12px] sm:text-[13px] leading-[1.75] m-0">
                                We source hand-picked cars from Japan, the UK, and the UAE. Every vehicle in our collection passes a strict 150-point quality inspection, so you always know exactly what you are getting — no hidden issues, no last-minute surprises.
                            </p>
                            <p className="text-white/50 text-[12px] sm:text-[13px] leading-[1.75] m-0">
                                From your first visit and test drive to paperwork, financing, and delivery, our team is with you at every step. We partner with 15+ leading banks to offer flexible EMI plans, and our pricing is always transparent with no hidden charges.
                            </p>
                            <p className="text-white/45 text-[12px] sm:text-[13px] leading-[1.75] m-0">
                                At ACN, we do not just sell cars — we build long-term relationships. Visit our Hyderabad showroom and experience a dealership that puts you first.
                            </p>
                        </div>

                        <div className="w-full h-px bg-white/10 mt-2" />

                        <div className="flex gap-10 sm:gap-14">
                            {STATS.map((stat, i) => (
                                <React.Fragment key={stat.label}>
                                    {i > 0 && <div className="w-px h-10 bg-white/10 self-center shrink-0" />}
                                    <div>
                                        <div className="font-michroma text-[22px] sm:text-[26px] text-white leading-none">{stat.value}</div>
                                        <div className="text-white/40 text-[10px] uppercase tracking-widest mt-1.5">{stat.label}</div>
                                    </div>
                                </React.Fragment>
                            ))}
                            <div className="w-px h-10 bg-white/10 self-center shrink-0" />
                            <div>
                                <div className="font-michroma text-[22px] sm:text-[26px] text-white leading-none">{stats.modelCount}</div>
                                <div className="text-white/40 text-[10px] uppercase tracking-widest mt-1.5">Models</div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-[min(420px,60vh)] bg-white/10 shrink-0" />
                    <div className="lg:hidden w-full h-px bg-white/10 shrink-0" />

                    {/* Right — visit */}
                    <div className="w-full lg:w-[44%] flex flex-col gap-5 lg:pl-14 xl:pl-20 min-h-0">
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest m-0 mb-1">Visit Us</p>
                            <p className="font-michroma text-white text-[15px] sm:text-[16px] uppercase m-0">ACN Cars, Hyderabad</p>
                            <p className="text-white/40 text-[11px] m-0 mt-1.5">Mon – Sat · 10 AM – 7 PM</p>
                        </div>

                        <DealershipMap className="min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]" />

                        <div className="w-full h-px bg-white/10" />

                        <div className="flex flex-col gap-4">
                            {CONTACT_ITEMS.map((item, i) => (
                                <React.Fragment key={item.label}>
                                    {i > 0 && <div className="w-full h-px bg-white/10" />}
                                    <div>
                                        <p className="text-white/40 text-[10px] uppercase tracking-widest m-0 mb-1">{item.label}</p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="text-white/70 text-[12px] sm:text-[13px] leading-relaxed no-underline hover:text-white transition-colors m-0"
                                            >
                                                {item.content}
                                            </a>
                                        ) : (
                                            <p className="text-white/70 text-[12px] sm:text-[13px] leading-relaxed m-0">{item.content}</p>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AboutScreen;
