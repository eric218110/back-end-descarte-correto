import { LoadAccountByToken } from '@domain/usecases/load-accout-by-token'
import { Decrypter } from '@data/protocols/criptography/decrypter'
import { AccountModel } from '../account/db-add-account-protocols'
import { LoadAccountByTokenRepository } from '@data/protocols/data/account/load-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(token, role)
    }
    return null
  }
}
