import * as hashPassword from "password-hash";
import * as hashObject from "object-hash";
import { v4 as createGuid } from "uuid";
declare function createRandomString(maxLength?: number): string;
export { hashPassword, createGuid, createRandomString, hashObject };
