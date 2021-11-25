import {Toaster as T} from "react-hot-toast";
import React from "react";

export const Toaster = () => (
    <T position="bottom-center"  reverseOrder={false} toastOptions=
    {{  duration: 2000,
        style: {
            borderRadius: '8px',
            backgroundColor: 'white',
            padding: '10px',
        },
        success: {
            iconTheme: {
                primary: '#7c6aef',
                secondary: '#FFF',
            }
        },
        error: {duration: 4000}}}/>
);