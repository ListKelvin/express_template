import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const catchErrors =
  (controller: AsyncRequestHandler): AsyncRequestHandler =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      // pass error on

      // Extract the original URL from the request (excluding query parameters)
      const originalUrl = "." + req.originalUrl;

      // res.locals.error = error;
      res.render(originalUrl, {
        layout: false,
        error: error,
      });
      // next(error);
    }
  };

export default catchErrors;
