import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    userData.password
  );
  console.log(isPasswordMatch);

  return userData;
};

export const AuthService = {
  loginUserIntoDB,
};
