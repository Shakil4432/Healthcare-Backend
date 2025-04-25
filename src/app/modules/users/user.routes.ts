import express, { Request, Response } from "express";
import { UserController } from "./user.controller";
const router = express.Router();
router.post("/", UserController.createAdminIntoSQL);

export const userRoutes = router;
