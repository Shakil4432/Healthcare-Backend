import { Request, Response } from "express";
import { UserSevice } from "./user.service";

const createAdminIntoSQL = async (req: Request, res: Response) => {
  try {
    const result = await UserSevice.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.name || "Something went wrong",
      error: error,
    });
  }
};

export const UserController = {
  createAdminIntoSQL,
};
