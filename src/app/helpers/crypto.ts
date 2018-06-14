import * as crypto from "crypto"
import * as hashPassword from "password-hash"
import * as hashObject from "object-hash"
import { v4 as createGuid } from "uuid"

function createRandomString(maxLength: number = 64): string {
  const buf = crypto.randomBytes(maxLength / 2)
  return buf.toString("hex").substr(0, maxLength)
}

export { hashPassword, createGuid, createRandomString, hashObject }
