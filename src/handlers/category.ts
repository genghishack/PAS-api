import {Serializer} from "jsonapi-serializer";
import {NextFunction, Request, Response} from "express";
import {IConstants} from "../types/constants";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, successJson} from "../lib/response.js";
import {getCategoryById, CategoryByIdWithProfessionals, listCategories} from "../sql/category.js";
import {getJsonApiSerializer} from "../lib/jsonapi.js";
import {adminShortProfessionalAttributes} from "./professional.js";

export const adminShortCategoryAttributes: string[] = [
  'name_display'
];

export const adminFullCategoryAttributes: string[] = [
  'name_slug', 'name_display'
];

export const adminListCategories = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const jsonapi: Serializer = getJsonApiSerializer('category', {
    topLevelLinks: {
      self: (): string => `${apiUrl}/category`,
    },
    attributes: [
      ...adminShortCategoryAttributes
    ]
  })

  try {
    const result: any = await listCategories();
    // log.debug({result});
    const jsonResult = jsonapi.serialize(result);
    // log.debug({jsonResult});
    return successJson(res, jsonResult);
  } catch (e) {
    return failure(res, e);
  }
}

export const adminGetCategory = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const {id} = req.params;
  const jsonapi: Serializer = getJsonApiSerializer('category', {
    topLevelLinks: {
      self: (dataSet: any): string => `${apiUrl}/category/${dataSet[0].id}`,
    },
    attributes: [
      ...adminFullCategoryAttributes,
    ],
  });

  try {
    const result: any = await getCategoryById(id, false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}

export const adminGetCategoryWithProfessionals = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const {id} = req.params;
  const jsonapi: Serializer = getJsonApiSerializer('category', {
    topLevelLinks: {
      self: (dataSet: any): string => `${apiUrl}/category/${dataSet[0].id}`,
    },
    attributes: [
      ...adminShortCategoryAttributes,
      'professionals',
    ],
    professionals: {
      ref: 'id',
      included: true,
      attributes: adminShortProfessionalAttributes
    },
    typeForAttribute: (attribute: string): string => {
      return (attribute === 'professionals') ? 'professional' : attribute;
    }
  })

  try {
    const result: any = await CategoryByIdWithProfessionals(id, false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}
