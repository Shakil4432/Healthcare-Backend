import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.name,
    error: err || "Something went wrong",
  });
  next();
};

export default globalErrorHandler;
