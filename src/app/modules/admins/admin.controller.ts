import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import HttpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const getAllAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await adminServices.getAllAdmin(filters, options);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin data fetched",
    data: result.data,
    meta: result.meta,
  });
});

const getAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.getAdminByIdFromDB(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin data fetched",
    data: result,
  });
});

const updateAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await adminServices.updateAdminByIdFromDB(id, data);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin data updated",
    data: result,
  });
});

const deleteAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  await adminServices.deleteAdminByIdFromDB(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin data deleted",
  });
});

const softDeleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  await adminServices.softDeleteAdminByIdFromDB(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin data soft deleted",
  });
});

export const adminController = {
  getAllAdminFromDB,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdmin,
};
