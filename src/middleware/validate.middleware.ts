import { Request, Response, NextFunction } from "express"
import { ZodType } from "zod"

export const validate = (schema: ZodType<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      message: "validation failed",
      errors: result.error.issues.map(e => ({
        field: e.path.join("."),
        message: e.message
      }))
    })
  }
  req.body = result.data
  next()
}


