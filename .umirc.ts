import {defineConfig} from "umi";
import {routes} from "./config/router";

export default defineConfig({
    routes,
    antd: {},
    npmClient: 'pnpm',
});
