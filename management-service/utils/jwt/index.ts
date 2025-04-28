import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { Profile } from "../../interfaces/Profile";

export const generateToken = (payload: Profile) => {
  const options: SignOptions = {
    algorithm: "RS256",
    expiresIn: "1h",
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER!,
  };

  const privateKey = process.env.PRIVATE_KEY!;

  return jwt.sign(payload, privateKey, options);
};

export const jwtValidator = (token: string) => {
  const validations: VerifyOptions = {
    algorithms: ["RS256"],
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER!,
  };
  const publicKey = process.env.INTERNAL_PUBLIC_KEY!;

  const decoded = jwt.verify(token, publicKey, validations);
  return decoded;
};
