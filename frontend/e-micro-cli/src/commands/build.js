import { createRsbuild, logger, loadConfig } from "@rsbuild/core";
import path from "node:path";
import { fileURLToPath } from "node:url";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');


export async function build() {
    const configPath = path.join(pkgRoot, "rsbuild.config.main.js");
    const { content } = await loadConfig({
        path: configPath,
    });
    const rsbuild = await createRsbuild({
        config: content
    });
    try {
        await rsbuild.build();
    } catch (err) {
        logger.error('Failed to build.');
        logger.error(err);
        process.exit(1);
    }
    // const server = await rsbuild.createDevServer();
    // await server.listen();
}