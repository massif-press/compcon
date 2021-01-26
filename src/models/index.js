// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserData } = initSchema(schema);

export {
  UserData
};