import { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"


export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = "AppError"
  }
}

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message} | Status: ${err.statusCode} | Path:${req.path}`)
    return res.status(err.statusCode).json({
      message: err.message
    })
  }
  if (err instanceof Error) {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack, path: req.path })
    return res.status(500).json({
      message: "Internal server error"
    })
  }

  logger.error("Unknown error occurred", {
    path: req.path,
    error: err
  })

  return res.status(500).json({
    message: "Internal server error"
  })
} 
