import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadByEmailRepository } from '../../protocols/data/load-by-email-repository'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadByEmailRepository: LoadByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadByEmailRepository.loadWithEmail(authentication.email)
    if (account) {
      await this.hashCompare.compare(authentication.password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return null
  }
}
