import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadByEmailRepository } from '../../../data/protocols/load-by-email-repository'

const makeFakeAccout = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_mail@mail.com',
  name: 'valid_name',
  password: 'valid_password'
})

const makeFakeRequest = (): AuthenticationModel => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

interface SutTypes {
  sut: Authentication
  loadByEmailRepositoryStub: LoadByEmailRepository
  fakeRequest: AuthenticationModel
}

const makeLoadByEmailRepository = (): LoadByEmailRepository => {
  class LoadByEmailRepositoryStub implements LoadByEmailRepository {
    async loadWithEmail (email: string): Promise<AccountModel> {
      return makeFakeAccout()
    }
  }
  return new LoadByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadByEmailRepositoryStub = makeLoadByEmailRepository()
  const sut = new DbAuthentication(loadByEmailRepositoryStub)
  const fakeRequest = makeFakeRequest()
  return {
    sut,
    loadByEmailRepositoryStub,
    fakeRequest
  }
}

describe('DbAuthenticate use case', () => {
  test('should call LoadByEmailRepository with email correct', async () => {
    const { sut, loadByEmailRepositoryStub, fakeRequest } = makeSut()
    const spyloadWithEmail = jest.spyOn(loadByEmailRepositoryStub, 'loadWithEmail')
    await sut.auth(fakeRequest)
    expect(spyloadWithEmail).toHaveBeenCalledWith(fakeRequest.email)
  })
})
