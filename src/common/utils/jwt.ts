/* eslint-disable @typescript-eslint/no-unsafe-argument */
import jwt from 'jsonwebtoken';

export const generateTokens = (payload: any) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '60m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
