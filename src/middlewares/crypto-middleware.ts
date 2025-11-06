// middlewares/crypto-middleware.ts
import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

type Envelope = {
  v: number;
  key: string;
  iv: string;
  ciphertext: string;
  tag: string;
  meta?: { kid?: string; alg?: string };
};

type KeyStore = Record<string, string>;

const PRIVATE_KEYS: KeyStore = {
  "server-rsa-v1": (process.env.SERVER_RSA_PRIV_PEM || "").replace(/\\n/g, "\n"),
};
const DEFAULT_KID = "server-rsa-v1";

function pickPrivateKey(kid?: string): string {
  const pem = (kid && PRIVATE_KEYS[kid]) || PRIVATE_KEYS[DEFAULT_KID];
  if (!pem) throw new Error("RSA private key missing");
  return pem;
}

function hasEnvelopeShape(b: any): b is Envelope {
  return b && typeof b === "object" && "key" in b && "iv" in b && "ciphertext" in b && "tag" in b;
}

function rsaOAEPDecrypt(encryptedKeyB64: string, privatePem: string): Buffer {
  const encryptedKey = Buffer.from(encryptedKeyB64, "base64");
  return crypto.privateDecrypt(
    {
      key: privatePem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedKey
  );
}

function aesGcmDecrypt(params: { key: Buffer; ivB64: string; ctB64: string; tagB64: string; aad?: Buffer }) {
  const iv = Buffer.from(params.ivB64, "base64");
  const ct = Buffer.from(params.ctB64, "base64");
  const tag = Buffer.from(params.tagB64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", params.key, iv);
  if (params.aad) decipher.setAAD(params.aad);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ct), decipher.final()]);
}

// middlewares/crypto-middleware.ts (cambia solo esta parte)
export function decryptBodyMiddleware(options?: { bindToMethodAndPath?: boolean }) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const hdr = (req.header("x-content-encryption") || "").toLowerCase();
      const looksEncrypted = hdr.includes("aes-256-gcm") || hasEnvelopeShape(req.body);
      if (!looksEncrypted) return next();

      const env = req.body as Envelope;
      const privatePem = pickPrivateKey(env.meta?.kid);

      const aesKey = rsaOAEPDecrypt(env.key, privatePem);
      if (aesKey.length !== 32) throw new Error("Invalid AES key length");

      // ✅ usa originalUrl para AAD (consistente con /api, /users, etc.)
      let aad: Buffer | undefined;
      if (options?.bindToMethodAndPath) {
        aad = Buffer.from(`${req.method}:${req.originalUrl}`, "utf8");
      }

      const plain = aesGcmDecrypt({
        key: aesKey,
        ivB64: env.iv, ctB64: env.ciphertext, tagB64: env.tag, aad
      });

      req.body = JSON.parse(plain.toString("utf8"));
      next();
    } catch (err: any) {
      res.status(400).json({ success: false, message: "Cuerpo cifrado inválido", error: err?.message ?? "decrypt-failed" });
    }
  };
}

