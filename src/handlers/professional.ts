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
  'name_last', 'name_first'
];

export const adminFullProfessionalAttributes: string[] = [
  'name_last', 'name_first', 'name_prefix', 'name_suffix'
];

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
      'bar_ids',
      'specialties',
      'speaking_topics',
      'addresses',
      'organizations',
      'publications',
      'categories',
      'comments',
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
    bar_ids: {
      ref: 'id',
      included: true,
      attributes: ['bar_id', 'state_abbr'],
    },
    specialties: {
      ref: 'id',
      included: true,
      attributes: ['name', 'description'],
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/specialty/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/specialty`
      }
    },
    speaking_topics: {
      ref: 'id',
      included: true,
      attributes: ['name', 'description'],
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/speaking_topic/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/speaking_topic`
      }
    },
    addresses: {
      ref: 'id',
      included: true,
      attributes: adminFullAddressAttributes,
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/address/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/address`
      }
    },
    organizations: {
      ref: 'id',
      included: true,
      attributes: adminShortOrganizationAttributes,
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/organization/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/organization`
      }
    },
    publications: {
      ref: 'id',
      included: true,
      attributes: adminShortPublicationAttributes,
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/publication/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/publication`
      }
    },
    categories: {
      ref: 'id',
      included: true,
      attributes: adminShortCategoryAttributes,
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/category/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/category`
      }
    },
    comments: {
      ref: 'id',
      included: true,
      attributes: [
        'comment', 'public', 'created_by', 'created_at', 'updated_by', 'updated_at'
      ],
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/comment/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/comment`
      }
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
        case 'bar_ids':
          return 'bar_id';
        case 'categories':
          return 'category';
        case 'comments':
          return 'comment';
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

export const adminListProfessionals = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const jsonapi: Serializer = getJsonApiSerializer('professional', {
    topLevelLinks: {
      self: (): string => `${apiUrl}/professional`,
    },
    dataLinks: {
      self: (dataSet: any, current: any): string => `${apiUrl}/professional/${current.id}`
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
    const result: any[] = await listProfessionals(false);
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
    dataLinks: {
      self: (dataSet: any, current: any): string => `${apiUrl}/professional/${current.id}`
    },
    attributes: [
      ...adminShortProfessionalAttributes,
      'addresses',
      'categories',
      'reason'
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
    const result: any = await listDeletedProfessionals(false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}
