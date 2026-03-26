import { Request, Response } from 'express';
import { registerUser } from "../services/auth.service";
import { loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error)
    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({ message: error.message });
    };
    return res.status(500).json({
      message: "Registration Failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error)
    if (error instanceof Error && error.message === "Invalid Credientials") {
      return res.status(401).json({ message: error.message })
    };
    return res.status(500).json({
      message: "Login Failed"
    });
  }
}
