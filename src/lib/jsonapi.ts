import {Serializer} from "jsonapi-serializer";

export const getJsonApiSerializer = (collectionName: string, opts: any) => {
  return new Serializer(collectionName, {
    ...opts,
    pluralizeType: false,
    keyForAttribute: 'camelCase',
  })
}

