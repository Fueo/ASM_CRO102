export const COLORS = {
    MAIN: "#007537",
    NEW: "#F6F6F6",
    WHITE: "#FFFFFF",
    BLACK: "#221F1F",
    GRAY: "#7D7B7B",
    LIGHT: "#ABABAB",
    ERROR: "#FF0000",
    GIOBIOGEN: "#2A3293",
    // Bổ sung màu gradient từ ảnh
    GRADIENT_PRIMARY: ["#007537", "#4CAF50"],
};

export const fonts = {
    regular: "Lato-Regular",
    bold: "Lato-Bold",
};

export const typography = {
    h1Medium: {
        fontSize: 24,
        lineHeight: 34,
        fontFamily: fonts.regular,
    },
    h1Bold: {
        fontSize: 24,
        lineHeight: 20,
        fontFamily: fonts.bold,
    },

    h2Bold: {
        fontSize: 20,
        lineHeight: 20,
        fontFamily: fonts.bold,
    },

    h3Medium: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: fonts.regular,
    },
    h3Regular: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: fonts.regular,
    },
    h3Bold: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: fonts.bold,
    },

    subMediumUppercase: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: fonts.regular,
        textTransform: "uppercase",
    },
    subMedium: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: fonts.regular,
    },
    subRegular: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: fonts.regular,
    },
    subBold: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: fonts.bold,
    },

    bodyRegular: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: fonts.regular,
    },
    bodyMedium: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: fonts.regular,
    },
    bodyBold: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: fonts.bold,
    },
};

const themes = {
    colors: COLORS,
    fonts,
    typography,
};

export default themes;