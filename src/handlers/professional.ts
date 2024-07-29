import {Serializer} from "jsonapi-serializer";
import {NextFunction, Request, Response} from "express";
import {IConstants} from "../types/constants";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, successJson} from "../lib/response.js";
import {getProfessionalById, listDeletedProfessionals, listProfessionals} from "../sql/professional.js";
import {getJsonApiSerializer} from "../lib/jsonapi.js";
import {adminShortCategoryAttributes} from "./category.js";
import {adminFullAddressAttributes, adminShortAddressAttributes} from "./address.js";
import {adminShortOrganizationAttributes} from "./organization.js";
import {adminShortPublicationAttributes} from "./publication.js";

export const adminShortProfessionalAttributes: string[] = [
  'name_last', 'name_first', 'name_prefix', 'name_suffix', 'organization', 'geojson'
];

export const adminFullProfessionalAttributes: string[] = [
  'name_last', 'name_first', 'name_prefix', 'name_suffix',
  'bar_id',
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
      'phone_numbers',
      'email_addresses',
      'urls',
      'media_handles',
      'specialties',
      'speaking_topics',
      'addresses',
      'organizations',
      'categories',
    ],
    phone_numbers: {
      ref: 'id',
      included: true,
      attributes: ['phone_number', 'phone_type'],
    },
    email_addresses: {
      ref: 'id',
      included: true,
      attributes: ['email_address', 'email_type'],
    },
    urls: {
      ref: 'id',
      included: true,
      attributes: ['url', 'url_type'],
    },
    media_handles: {
      ref: 'id',
      included: true,
      attributes: ['media_handle', 'media_type'],
    },
    specialties: {
      ref: 'id',
      included: true,
      attributes: ['name', 'description'],
    },
    speaking_topics: {
      ref: 'id',
      included: true,
      attributes: ['name', 'description'],
    },
    addresses: {
      ref: 'id',
      included: true,
      attributes: adminFullAddressAttributes,
    },
    organizations: {
      ref: 'id',
      included: true,
      attributes: adminShortOrganizationAttributes,
    },
    publications: {
      ref: 'id',
      included: true,
      attributes: adminShortPublicationAttributes,
    },
    categories: {
      ref: 'id',
      included: true,
      attributes: adminShortCategoryAttributes,
    },
    typeForAttribute: (attribute: string): string => {
      switch (attribute) {
        case 'phone_numbers':
          return 'phone_number';
        case 'email_addresses':
          return 'email_address';
        case 'urls':
          return 'url';
        case 'media_handles':
          return 'media_handle';
        case 'specialties':
          return 'specialty';
        case 'speaking_topics':
          return 'speaking_topic';
        case 'addresses':
          return 'address';
        case 'organizations':
          return 'organization';
        case 'publications':
          return 'publication';
        case 'categories':
          return 'category';
        default:
          return attribute;
      }
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
