'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',

});

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#68F768',
            contrastText: '#FFFFFF'
        },
        text: {
            disabled: '#8CAA8C !important'
        }
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});

export default theme;