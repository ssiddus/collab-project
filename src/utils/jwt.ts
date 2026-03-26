import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/auth.types"
export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h"
  });
};
