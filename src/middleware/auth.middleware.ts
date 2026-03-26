import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/auth.types"
import { TokenPayload } from "../types/auth.types";

/*
  Auth middleware ensures that only authenticated users can access protected routes by verifying the JWT before the request
  reaches the controller.
*/


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    req.user = decoded;
    /*
        Why use req.user instead of request body?
    
        => We should never trust client-provided ownership fields like orgId.
        Instead, we extract it from the JWT payload, which is signed by the server.
        This ensures security and prevents users from accessing or modifying data
        belonging to other organisation. It also avoids unnecessary database lookups.
    */
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token"
    })

  }
};
