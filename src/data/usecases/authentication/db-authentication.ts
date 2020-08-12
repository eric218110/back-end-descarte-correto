import {
  Authentication,
  AuthenticationModel,
  HashCompare,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authenticate-protocols'
export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadWithEmail(authentication.email)
    if (account) {
      const isValidCompare = await this.hashCompare.compare(authentication.password, account.password)
      if (isValidCompare) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
