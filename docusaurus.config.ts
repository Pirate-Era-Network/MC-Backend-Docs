import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
    title: "MC-Backend Docs",
    tagline: "Option catalog for the Denizen MMORPG backend.",
    favicon: "img/favicon.svg",

    url: "https://pirate-era-network.github.io",
    baseUrl: "/MC-Backend-Docs/",

    organizationName: "Pirate-Era-Network",
    projectName: "MC-Backend-Docs",
    trailingSlash: false,

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    markdown: {
        mermaid: true,
    },
    themes: ["@docusaurus/theme-mermaid"],

    presets: [
        [
            "classic",
            {
                docs: {
                    routeBasePath: "/",
                    sidebarPath: "./sidebars.ts",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: "img/logo.png",
        navbar: {
            title: "MC-Backend Docs",
            items: [],
        },
        footer: {
            style: "light",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Intro",
                            to: "/",
                        },
                    ],
                },
                {
                    title: "Community",
                    items: [
                        {
                            label: "Denizen Discord",
                            href: "https://discord.gg/Q6pZGSR",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/Pirate-Era-Network/mc-denizen-core-backend",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Pirate Era. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.vsLight,
            darkTheme: prismThemes.vsDark,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
