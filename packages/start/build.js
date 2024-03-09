import {glob} from "glob";
import {copyFile, mkdir, rmdir} from "node:fs/promises"
import { join, dirname } from "node:path";

await rmdir("dist", { recursive: true });

const SOURCE_FOLDERS = ["client", "config", "middleware", "server", "shared", "router"]

const assets = [...await glob(`./{${SOURCE_FOLDERS.join(",")}}/**/*.css`), "./package.json"]

await Promise.all(assets.map(async a => {
	await mkdir(join("dist", dirname(a)), { recursive: true })
	await copyFile(a, `dist/${a}`);
}))