import {NextFunction, Request, Response} from "express";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, success} from "../lib/response.js";
import {listCategories} from "../sql/category.js";

export const adminListCategories = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  try {
    const categories: any[] = await listCategories();
    return success(res, {data: categories, count: categories.length})
  } catch (e) {
    return failure(res, e)
  }
}
