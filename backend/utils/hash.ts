import crypto from "crypto";

function sortKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, k) => {
        acc[k] = sortKeys(obj[k]);
        return acc;
      }, {});
  }
  return obj;
}

export function credentialId(payload: any): string {
  const canonical = JSON.stringify(sortKeys(payload));
  return crypto.createHash("sha256").update(canonical).digest("hex");
}
