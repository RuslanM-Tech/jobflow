import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Resolve relative to this file so starting Node from another folder also works.
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });
