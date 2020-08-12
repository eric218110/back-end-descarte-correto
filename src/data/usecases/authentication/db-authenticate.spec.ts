import { Authentication } from '../../../domain/usecases/authentication'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadByEmailRepository } from '../../../data/protocols/load-by-email-repository'

interface SutTypes {
  sut: Authentication
  loadByEmailRepositoryStub: LoadByEmailRepository
}

const makeLoadByEmailRepository = (): LoadByEmailRepository => {
  class LoadByEmailRepositoryStub implements LoadByEmailRepository {
    async loadWithEmail (email: string): Promise<AccountModel> {
      return {
        id: 'valid_id',
        email: 'valid_mail@mail.com',
        name: 'valid_name',
        password: 'valid_password'
      }
    }
  }
  return new LoadByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadByEmailRepositoryStub = makeLoadByEmailRepository()
  const sut = new DbAuthentication(loadByEmailRepositoryStub)
  return {
    sut,
    loadByEmailRepositoryStub
  }
}

describe('DbAuthenticate use case', () => {
  test('should call LoadByEmailRepository with email correct', async () => {
    const { sut, loadByEmailRepositoryStub } = makeSut()
    const spyloadWithEmail = jest.spyOn(loadByEmailRepositoryStub, 'loadWithEmail')
    await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
    expect(spyloadWithEmail).toHaveBeenCalledWith('any_mail@mail.com')
  })
})
