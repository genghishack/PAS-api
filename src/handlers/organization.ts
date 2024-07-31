import {Serializer} from "jsonapi-serializer";
import {NextFunction, Request, Response} from "express";
import {IConstants} from "../types/constants";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, successJson} from "../lib/response.js";
import {getJsonApiSerializer} from "../lib/jsonapi.js";
import {adminFullAddressAttributes, adminShortAddressAttributes} from "./address.js";
import {adminShortCategoryAttributes} from "./category.js";
import {getOrganizationById, listDeletedOrganizations, listOrganizations} from "../sql/organization.js";
import {adminShortPublicationAttributes} from "./publication.js";
import {adminShortProfessionalAttributes} from "./professional.js";

export const adminShortOrganizationAttributes: string[] = [
  'name_display'
];

export const adminFullOrganizationAttributes: string[] = [
  'name_slug', 'name_display'
];

export const adminGetOrganization = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const {id} = req.params;
  const jsonapi: Serializer = getJsonApiSerializer('organization', {
    topLevelLinks: {
      self: (dataSet: any): string => `${apiUrl}/organization/${dataSet[0].id}`,
    },
    attributes: [
      ...adminFullOrganizationAttributes,
      'phone_numbers',
      'email_addresses',
      'urls',
      'media_handles',
      'specialties',
      'addresses',
      'publications',
      'professionals',
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
    professionals: {
      ref: 'id',
      included: true,
      attributes: adminShortProfessionalAttributes,
      includedLinks: {
        self: (record: any, current: any) => {
          return (current) ? `${apiUrl}/professional/${current.id}` : null;
        }
      },
      relationshipLinks: {
        related: `${apiUrl}/professional`
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
        case 'addresses':
          return 'address';
        case 'professionals':
          return 'professional';
        case 'publications':
          return 'publication';
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
    const result: any = await getOrganizationById(id, false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}

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
    const result: any[] = await listOrganizations(false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}

export const adminListDeletedOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {api: {full: apiUrl}}: IConstants = constants;
  const jsonapi: Serializer = getJsonApiSerializer('organization', {
    topLevelLinks: {
      self: (): string => `${apiUrl}/organization/deleted`,
    },
    dataLinks: {
      self: (dataSet: any, current: any): string => `${apiUrl}/organization/${current.id}`
    },
    attributes: [
      ...adminShortOrganizationAttributes,
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
    const result: any[] = await listDeletedOrganizations(false);
    return successJson(res, jsonapi.serialize(result));
  } catch (e) {
    return failure(res, e);
  }
}
