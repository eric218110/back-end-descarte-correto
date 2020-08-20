import {
  Authentication,
  AuthenticationModel,
  HashCompare,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authenticate-protocols'
import { Encrypter } from '@data/protocols/criptography/encrypter'
export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadWithEmail(authentication.email)
    if (account) {
      const isValidCompare = await this.hashCompare.compare(authentication.password, account.password)
      if (isValidCompare) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
