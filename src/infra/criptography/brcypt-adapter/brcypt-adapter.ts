import bcrypt from 'bcrypt'
import { Encrypter } from '@data/protocols/criptography/encrypter'
import { HashCompare } from '@data/protocols/criptography/hash-compare'

export class BCryptAdapter implements Encrypter, HashCompare {
  constructor(private readonly salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare(hash: string, compareHash: string): Promise<boolean> {
    const isEquals = await bcrypt.compare(hash, compareHash)
    return isEquals
  }
}
