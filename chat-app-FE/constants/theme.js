import { scale, verticalScale } from "../utils/styling";

export const colors = {
    primary: "#6366F1",      // Indigo 500 - Main Brand Color
    primaryLight: "#818CF8", // Indigo 400 - Lighter accents
    primaryDark: "#4F46E5",  // Indigo 600 - Darker interactions
    text: "#1E293B",         // Slate 800 - Main Text (Softer than black)
    textLight: "#64748B",    // Slate 500 - Secondary Text
    background: "#F8FAFC",   // Slate 50 - Main Background (Clean & crisp)
    white: "#fff",
    black: "#000",
    rose: "#F43F5E",         // Rose 500 - Errors/Delete
    otherBubble: "#E0E7FF",  // Indigo 100 - Incoming messages
    myBubble: "#6366F1",     // Indigo 500 - Outgoing messages (matches primary)
    green: "#10B981",        // Emerald 500 - Success
    neutral50: "#F9FAFB",
    neutral100: "#F3F4F6",
    neutral200: "#E5E7EB",
    neutral300: "#D1D5DB",
    neutral350: "#9CA3AF",
    neutral400: "#6B7280",
    neutral500: "#64748B",   // Slate 500
    neutral600: "#475569",   // Slate 600
    neutral700: "#334155",   // Slate 700
    neutral800: "#1E293B",   // Slate 800
    neutral900: "#0F172A",   // Slate 900
};

export const spacingX = {
    _3: scale(3),
    _5: scale(5),
    _7: scale(7),
    _10: scale(10),
    _12: scale(12),
    _15: scale(15),
    _20: scale(20),
    _25: scale(25),
    _30: scale(30),
    _35: scale(35),
    _40: scale(40),
};

export const spacingY = {
    _5: verticalScale(5),
    _7: verticalScale(7),
    _10: verticalScale(10),
    _12: verticalScale(12),
    _15: verticalScale(15),
    _17: verticalScale(17),
    _20: verticalScale(20),
    _25: verticalScale(25),
    _30: verticalScale(30),
    _35: verticalScale(35),
    _40: verticalScale(40),
    _50: verticalScale(50),
    _60: verticalScale(60),
};

export const radius = {
    _3: verticalScale(3),
    _6: verticalScale(6),
    _10: verticalScale(10),
    _12: verticalScale(12),
    _15: verticalScale(15),
    _17: verticalScale(17),
    _20: verticalScale(20),
    _30: verticalScale(30),
    _40: verticalScale(40),
    _50: verticalScale(50),
    _60: verticalScale(60),
    _70: verticalScale(70),
    _80: verticalScale(80),
    _90: verticalScale(90),
    full: 200,
};