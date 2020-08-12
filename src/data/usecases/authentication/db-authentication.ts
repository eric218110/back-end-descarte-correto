import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadByEmailRepository } from '../../protocols/data/load-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadByEmailRepository: LoadByEmailRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadByEmailRepository.loadWithEmail(authentication.email)
    return ''
  }
}
