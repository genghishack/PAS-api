import {Serializer} from "jsonapi-serializer";
import Inflector from 'inflected';

export const getJsonApiSerializer = (collectionName: string, opts: any) => {
  return new Serializer(collectionName, {
    ...opts,
    pluralizeType: false,
    keyForAttribute: function (attribute: string) {
      return Inflector.underscore(attribute);
    }
  })
}

