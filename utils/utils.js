import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';

export function hashedPwd(password) {
  if (!(password)) {
    return null;
  }

  return sha1(password);
}

export function extractbase64Header(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const regex = /^Basic\s+([\w+/=]+)$/;
  const match = authorizationHeader.match(regex);
  if (!match) {
    return null;
  }

  const base64HeaderValue = match[1];
  try {
    const decodeString = Buffer.from(base64HeaderValue, 'base64').toString('utf8');
    return decodeString;
  } catch (e) {
    return null;
  }
}

export function generateToken() {
  const token = uuidv4();
  return token;
}
