import jwt, { VerifyOptions } from "jsonwebtoken";

export const jwtValidator = (token: string) => {
  const validations: VerifyOptions = {
    algorithms: ["RS256"],
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER!,
  };
  const publicKey = process.env.MANAGEMENT_PUBLIC_KEY!;

  const decoded = jwt.verify(token, publicKey, validations);
  return decoded;
};
