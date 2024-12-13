const BGs = {
    light: [
        require('../assets/backgrounds/background2.jpg'),
        require('../assets/backgrounds/springDay.jpg'),
        require('../assets/backgrounds/summerDay.jpg'),
        require('../assets/backgrounds/autumnDay.jpg'),
        require('../assets/backgrounds/winterDay.jpg'),
    ],
    dark: [
        require('../assets/backgrounds/backgroundDark.jpg'),
        require('../assets/backgrounds/springNight.jpg'),
        require('../assets/backgrounds/summerNight.jpg'),
        require('../assets/backgrounds/autumnNight.jpg'),
        require('../assets/backgrounds/winterNight.jpg'),
    ],
};

export const getBGImage = (isDarkTheme, index = 0) => {
    const themeKey = isDarkTheme ? 'dark' : 'light';
    return BGs[themeKey][index % BGs[themeKey].length];
};

export default BGs;