import express, { Request, Response } from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// two maps so lookups are O(1) both ways: redirect needs code->url, dedup check needs url->code
const codeToUrl = new Map<string, string>();
const urlToCode = new Map<string, string>();

// reuse JS's own URL parser instead of a fragile hand-written regex
function isValidUrl(value: unknown): value is string{
    if (typeof value !== "string") return false;
    try {
        new URL (value);
        return true;
    }   catch {
        return false;
    }
}

// random hex code; loop regenerates on the rare chance of a collision
function generateShortCode(): string {
    let code: string;
    do {
        code = crypto.randomBytes(3).toString("hex");
    }   while (codeToUrl.has(code));
    return code;
}

// POST / - create a short code for a URL, or reuse one if it already exists
app.post("/", (req: Request, res: Response) => {
    const { url } = req.body;

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "A valid url is required"});
    }

    // dedup: same URL submitted twice returns the same short code
    let code = urlToCode.get(url);
    if (!code) {
        code = generateShortCode();
        codeToUrl.set(code, url);
        urlToCode.set(url, code);
    }

    res.json({ short_url: `/${code}`, url});
});

// GET /:code - look up the code and issue a real HTTP 301 redirect, or 404 if unknown
app.get("/:code", (req: Request, res: Response) => {
    const { code } = req.params;

    // narrows the type for TypeScript; also a real runtime safety net
    if (typeof code !== "string") {
        return res.status(400).json({ error: "Invalid code" });
    }

    const url = codeToUrl.get(code);

    if (!url) {
        return res.status(404).json({ error: "Short URL not found"});
    }

    res.redirect(301, url);
});

app.listen(PORT, () => {
    console.log(`Server running at  http://localhost:${PORT}`);
});