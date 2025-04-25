import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import { UserStatus } from "../../../../generated/prisma";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email as string,
      role: userData.role as string,
    },
    "addggertwe",
    "10m"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "dfgfsf45r34fd",
    "365d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChanged,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, "dfgfsf45r34fd");
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email as string,
      role: userData.role as string,
    },
    "addggertwe",
    "10m"
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChanged,
  };
};

export const AuthService = {
  loginUserIntoDB,
  refreshToken,
};
