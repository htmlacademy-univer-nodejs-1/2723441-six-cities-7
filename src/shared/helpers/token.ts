import * as crypto from 'node:crypto';
import {Token} from '../types/index.js';

export function generateSessionToken(byteLength = 32): Token {
  return crypto.randomBytes(byteLength).toString('hex');
}
