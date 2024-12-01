const BGs = {
    light: [
        require('../assets/backgrounds/background2.png'),
        require('../assets/backgrounds/springDay.png'),
        require('../assets/backgrounds/summerDay.png'),
        require('../assets/backgrounds/autumnDay.png'),
        require('../assets/backgrounds/winterDay.png'),
    ],
    dark: [
        require('../assets/backgrounds/backgroundDark.png'),
        require('../assets/backgrounds/springNight.png'),
        require('../assets/backgrounds/summerNight.png'),
        require('../assets/backgrounds/autumnNight.png'),
        require('../assets/backgrounds/winterNight.png'),
    ],
};

export const getBGImage = (isDarkTheme, index = 0) => {
    const themeKey = isDarkTheme ? 'dark' : 'light';
    return BGs[themeKey][index % BGs[themeKey].length];
};

export default BGs;