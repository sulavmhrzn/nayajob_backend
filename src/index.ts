import dotenv from "dotenv";
import express from "express";
import pc from "picocolors";
import healthCheckRouter from "./routes/healthCheck.route.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use("/api/health-check", healthCheckRouter);

if (!process.env.PORT) {
    console.log(
        pc.yellow(
            `${pc.bold(
                "PORT"
            )} is not defined in the environment variables. Using default port 8000.`
        )
    );
}
app.listen(PORT, () => {
    console.log(pc.green(`Server is running on port ${PORT}`));
});
