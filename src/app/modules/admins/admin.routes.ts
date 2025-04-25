import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { adminValidations } from "./admin.validations";
const router = express.Router();

router.get("/", adminController.getAllAdminFromDB);
router.get("/:id", adminController.getAdminById);
router.patch(
  "/:id",
  validateRequest(adminValidations.updateAdminSchema),
  adminController.updateAdminById
);
router.delete("/:id", adminController.deleteAdminById);
router.delete("/soft/:id", adminController.softDeleteAdmin);
export const AdminsRoutes = router;
