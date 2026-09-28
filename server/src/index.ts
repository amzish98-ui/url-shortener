import express, { Request, Response } from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const codeToUrl = new Map<string, string>();
const urlToCode = new Map<string, string>();

function isValidUrl(value: unknown): value is string{
    if (typeof value !== "string") return false;
    try {
        new URL (value);
        return true;
    }   catch {
        return false;
    }
}

function generateShortCode(): string {
    let code: string;
    do {
        code = crypto.randomBytes(3).toString("hex");
    }   while (codeToUrl.has(code));
    return code;
}

app.post("/", (req: Request, res: Response) => {
    const { url } = req.body;

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "A valid url is required"});
    }

    let code = urlToCode.get(url);
    if (!code) {
        code = generateShortCode();
        codeToUrl.set(code, url);
        urlToCode.set(url, code);
    }

    res.json({ short_url: `/${code}`, url});
});

app.get("/:code", (req: Request, res: Response) => {
    const { code } = req.params;
    const url = codeToUrl.get(code);

    if (!url) {
        return res.status(404).json({ error: "Short URL not found"});
    }

    res.redirect(301, url);
});

app.listen(PORT, () => {
    console.log(`Server running at  http://localhost:${PORT}`);
});