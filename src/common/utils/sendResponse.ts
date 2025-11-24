import { Response } from 'express';

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data: data ?? null,
  });
};
