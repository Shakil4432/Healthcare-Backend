import { Admin, Prisma, UserStatus } from "../../../../generated/prisma";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { adminSearchableFields } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";

const getAllAdmin = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, skip } = paginationHelper.calculatePagination(options);

  const andCondition: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  andCondition.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminByIdFromDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });
  return result;
};

const deleteAdminByIdFromDB = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    const deleteUser = await transactionClient.user.delete({
      where: {
        email: deleteAdmin.email,
      },
    });
    return deleteAdmin;
  });

  return result;
};

const softDeleteAdminByIdFromDB = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteAdmin = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const deleteUser = await transactionClient.user.update({
      where: {
        email: deleteAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deleteAdmin;
  });
  return result;
};
export const adminServices = {
  getAllAdmin,
  getAdminByIdFromDB,
  updateAdminByIdFromDB,
  deleteAdminByIdFromDB,
  softDeleteAdminByIdFromDB,
};
