export declare const DONATE: {
    paypal: {
        address: string;
        qr: string;
    };
    usdt: {
        address: string;
        qr: string;
    };
};
export declare function trackClick(kind: 'paypal' | 'usdt'): void;
export declare function getDonationInfo(): typeof DONATE;
//# sourceMappingURL=donate.d.ts.map