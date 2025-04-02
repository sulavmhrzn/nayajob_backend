import pino from "pino";
import { pinoLoggerConfig } from "./config.ts";
export const logger = pino(pinoLoggerConfig);
