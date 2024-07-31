import {Serializer} from "jsonapi-serializer";
import {NextFunction, Request, Response} from "express";
import {IConstants} from "../types/constants";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, successJson} from "../lib/response.js";
import {getJsonApiSerializer} from "../lib/jsonapi.js";
import {adminShortAddressAttributes} from "./address.js";
import {adminShortCategoryAttributes} from "./category.js";
import {listOrganizations} from "../sql/organization.js";

export const adminShortOrganizationAttributes: string[] = [
  'name_display'
];

export const adminFullOrganizationAttributes: string[] = [
  'name_slug', 'name_display'
];

export const adminListOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const jsonapi: Serializer = getJsonApiSerializer('organization', {
    topLevelLinks: {
      self: (): string => `${apiUrl}/organization`,
    },
    dataLinks: {
      self: (dataSet: any, current: any): string => `${apiUrl}/organization/${current.id}`
    },
    attributes: [
      ...adminShortOrganizationAttributes,
      'addresses',
      'categories',
    ],
    addresses: {
      ref: 'id',
      included: true,
      attributes: adminShortAddressAttributes,
    },
    categories: {
      ref: 'id',
      included: true,
      attributes: adminShortCategoryAttributes,
    },
    typeForAttribute: (attribute: string): string => {
      if (attribute === 'addresses') {
        return 'address'
      } else {
        return (attribute === 'categories') ? 'category' : attribute;
      }
    },
  })

  try {
    const result: any[] = await listOrganizations(true);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}
