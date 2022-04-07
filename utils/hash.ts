import crypto from "crypto";

const hash = (str: string) =>
  crypto.createHash("sha256").update(str).digest("hex");

export default hash;
