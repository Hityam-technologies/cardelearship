import React from 'react';
import DealershipMap from './dealershipMap';

const OFFER_CARDS = [
    {
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 6v12" />
                <path d="M15 8.5H10.5a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H9" />
            </svg>
        ),
        title: 'Competitive Pricing',
        description: 'NO HIDDEN CHARGES, NO MARKUPS. JUST FAIR AND HONEST PRICES EVERY TIME.',
    },
    {
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
        ),
        title: 'Roadside Assistance',
        description: 'STUCK ON THE ROAD? OUR SUPPORT TEAM IS JUST ONE CALL AWAY, ANYTIME.',
    },
    {
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
            </svg>
        ),
        title: 'Certified Quality Guarantee',
        description: 'EVERY CAR PASSES OUR STRICT 150-POINT INSPECTION BEFORE IT REACHES YOU.',
    },
    {
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
        title: 'Easy EMI and Financing',
        description: 'FLEXIBLE PAYMENT PLANS WITH LOW INTEREST RATES FROM 12+ TOP BANKS WORLDWIDE.',
    },
];

const OfferCard = ({ icon, title, description }) => (
    <div className="w-full transition-transform duration-300 hover:-translate-y-1.5">
        <div className="flex w-full min-w-0">
            <div className="relative w-[60px] sm:w-[72px] h-[120px] sm:h-[132px] shrink-0">
                <div className="absolute top-[-6px] left-[-6px] w-[56px] sm:w-[64px] h-[56px] sm:h-[64px] bg-[#262626] rounded-full flex items-center justify-center text-white z-10">
                    {icon}
                </div>
                <div className="absolute bottom-0 right-0 w-[36px] h-[36px] bg-transparent rounded-br-[36px] shadow-[18px_18px_0_18px_#fafafa] z-0 pointer-events-none" />
            </div>

            <div className="flex-1 bg-white rounded-tr-[16px] rounded-tl-[20px] min-h-[100px] sm:min-h-[122px] flex items-center pl-4 sm:pl-6 pr-3 min-w-0">
                <h3 className="font-michroma text-[14px] sm:text-[16px] md:text-[17px] font-normal text-black m-0 leading-[1.35]">{title}</h3>
            </div>
        </div>

        <div className="bg-white rounded-b-[16px] rounded-tl-[20px] px-4 sm:px-6 pt-2 pb-5 sm:pb-6 min-h-[160px] sm:min-h-[194px] flex items-end">
            <p className="text-[#666] text-[11px] sm:text-[13px] leading-[1.65] tracking-[0.4px] uppercase m-0 font-semibold">
                {description}
            </p>
        </div>
    </div>
);

const OfferSection = () => {
    const col1 = OFFER_CARDS.slice(0, 2);
    const col2 = OFFER_CARDS.slice(2, 4);

    return (
        <section className="w-full max-w-[1400px] mx-auto py-10 md:py-12 px-4 sm:px-8 xl:px-10 overflow-hidden shrink-0">
            <div className="flex flex-col xl:flex-row xl:items-start gap-12 xl:gap-16 min-w-0">
                <div className="xl:w-[45%] xl:max-w-[660px] shrink-0 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-stretch sm:items-start">
                        <div className="flex-1 bg-[#f2f2f2] rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 flex flex-col gap-4 sm:gap-5 min-w-0">
                            {col1.map((card) => (
                                <OfferCard key={card.title} {...card} />
                            ))}
                        </div>
                        <div className="flex-1 bg-[#f2f2f2] rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 flex flex-col gap-4 sm:gap-5 sm:mt-16 md:mt-20 min-w-0">
                            {col2.map((card) => (
                                <OfferCard key={card.title} {...card} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="xl:flex-1 flex flex-col min-w-0 xl:pt-1">
                    <div className="flex flex-col gap-3 max-w-[520px]">
                        <span className="text-[#888] font-michroma text-[11px] font-bold tracking-[2px] uppercase">
                            [ WHAT WE OFFER_ ]
                        </span>
                        <h2 className="font-michroma text-[30px] sm:text-[38px] lg:text-[44px] leading-[1.12] font-normal uppercase text-black m-0 tracking-wide">
                            Everything we do is<br />built<br />around you
                        </h2>
                        <p className="text-[#999] text-[11px] sm:text-[12px] leading-[1.8] tracking-[0.4px] uppercase m-0 mt-1 max-w-[480px]">
                            WE DON&apos;T JUST SELL CARS. WE BUILD RELATIONSHIPS THAT LAST LONG AFTER DELIVERY.
                        </p>
                    </div>

                    <DealershipMap className="max-w-[800px] mx-auto min-h-[240px] sm:min-h-[320px] max-h-[460px] mt-8 sm:mt-10 xl:mt-8 z-10" />
                </div>
            </div>
        </section>
    );
};

export default OfferSection;
