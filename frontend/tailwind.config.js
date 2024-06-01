/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}", 
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg-color)",
                main: "var(--main-color)",
                caret: "var(--caret-color)",
                sub: "var(--sub-color)",
                "sub-alt": "var(--sub-alt-color)",
                text: "var(--text-color)",
                error: "var(--error-color)",
                "error-extra": "var(--error-extra-color)",
                "colorful-error-extra": "var(--colorful-error-color)",
                "color-error-extra-color": "var(--color-error-extra-color)",
                  
            }
        },
    },
    plugins: [require('flowbite/plugin')],

};
