import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

const b64Preview = (s: string, n = 32) =>
  s.length > n ? s.slice(0, n) + "…" : s;

export function decryptBodyMiddleware(opts?: { bindToMethodAndPath?: boolean }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const encHdr = req.header("x-content-encryption") || "";
    const looksEnc = encHdr.includes("aes-256-gcm") ||
                     (req.body && typeof req.body === "object" &&
                      "key" in req.body && "iv" in req.body && "ciphertext" in req.body && "tag" in req.body);

    if (!looksEnc) return next();

    try {
      // 1) Log de sobre (sin datos sensibles)
      console.info(`[crypto] ${req.method} ${req.originalUrl} encHdr="${encHdr}"`);
      const env = req.body as any;
      console.info(`[crypto] envelope lens key=${String(env.key||"").length} iv=${String(env.iv||"").length} ct=${String(env.ciphertext||"").length} tag=${String(env.tag||"").length}`);
      console.info(`[crypto] iv.b64=${b64Preview(env.iv)} ct.b64=${b64Preview(env.ciphertext)}`);

      // 2) Cargar privada
      const pemRaw = (process.env.SERVER_RSA_PRIV_PEM || "").replace(/\\n/g, "\n").trim() + "\n";

      // 3) RSA-OAEP-256
      const keyObj = crypto.createPrivateKey({ key: pemRaw, format: "pem" });
      const encKey = Buffer.from(env.key, "base64");
      console.info(`[crypto] encKey bytes=${encKey.length} (modulus=${(keyObj.asymmetricKeyDetails?.modulusLength||0)/8})`);
      const aesKey = crypto.privateDecrypt(
        { key: keyObj, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
        encKey
      );
      console.info(`[crypto] RSA OK, aesKey bytes=${aesKey.length}`);

      // 4) (Opcional) AAD
      let aad: Buffer | undefined;
      if (opts?.bindToMethodAndPath) {
        aad = Buffer.from(`${req.method}:${req.originalUrl}`, "utf8");
        console.info(`[crypto] AAD="${req.method}:${req.originalUrl}"`);
      }

      // 5) AES-GCM
      const iv = Buffer.from(env.iv, "base64");
      const ct = Buffer.from(env.ciphertext, "base64");
      const tag = Buffer.from(env.tag, "base64");
      const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv);
      if (aad) decipher.setAAD(aad);
      decipher.setAuthTag(tag);
      const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
      console.info(`[crypto] GCM OK, plain bytes=${plain.length}`);

      // 6) Reemplaza body y sigue
      req.body = JSON.parse(plain.toString("utf8"));
      return next();

    } catch (e: any) {
      console.error(`[crypto] ERROR: ${e?.message}`);
      return res.status(400).json({ success:false, message:"Cuerpo cifrado inválido", error: e?.message || "decrypt-failed" });
    }
  };
}