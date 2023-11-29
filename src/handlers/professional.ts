import {Serializer} from "jsonapi-serializer";
import {NextFunction, Request, Response} from "express";
import {IConstants} from "../types/constants";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, successJson} from "../lib/response.js";
import {getProfessionalById, listDeletedProfessionals, listProfessionals} from "../sql/professional.js";
import {getJsonApiSerializer} from "../lib/jsonapi.js";
import {adminShortCategoryAttributes} from "./category.js";

export const adminShortProfessionalAttributes: string[] = [
  'name_last', 'name_first', 'name_prefix', 'name_suffix',
  'address_city', 'address_state', 'address_country', 'organization'
];

export const adminFullProfessionalAttributes: string[] = [
  'name_last', 'name_first', 'name_prefix', 'name_suffix', 'name_json',
  'phone_main', 'phone_fax', 'phone_cell', 'email', 'web_url', 'social_media_ids', 'contact_json',
  'address_street_1', 'address_street_2', 'address_city', 'address_state',
  'address_postal_code', 'address_country', 'address_json',
  'organization', 'specialties', 'speaking_topic', 'publications', 'bar_id',
  'comments', 'internal_comments', 'internal_reminders'
];

export const adminListProfessionals = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const jsonapi: Serializer = getJsonApiSerializer('professional', {
    topLevelLinks: {
      self: (): string => `${apiUrl}/professional`,
    },
    attributes: [
      ...adminShortProfessionalAttributes,
      'categories',
    ],
    categories: {
      ref: 'id',
      included: true,
      attributes: adminShortCategoryAttributes,
    },
    typeForAttribute: (attribute: string): string => {
      return (attribute === 'categories') ? 'category' : attribute;
    },
  })

  try {
    const result: any[] = await listProfessionals(true);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}

export const adminGetProfessional = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const {id} = req.params;
  const jsonapi: Serializer = getJsonApiSerializer('professional', {
    topLevelLinks: {
      self: (dataSet: any): string => `${apiUrl}/professional/${dataSet[0].id}`,
    },
    attributes: [
      ...adminFullProfessionalAttributes,
      'categories',
    ],
    categories: {
      ref: 'id',
      included: true,
      attributes: adminShortCategoryAttributes,
    },
    typeForAttribute: (attribute: string): string => {
      return (attribute === 'categories') ? 'category' : attribute;
    },
  });

  try {
    const result: any = await getProfessionalById(id, false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}

export const adminListDeletedProfessionals = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const jsonapi: Serializer = getJsonApiSerializer('professional', {
    topLevelLinks: {
      self: (): string => `${apiUrl}/professional/deleted`,
    },
    attributes: [
      ...adminFullProfessionalAttributes,
      'categories',
      'reason'
    ]
  })

  try {
    const result: any = await listDeletedProfessionals(false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}
