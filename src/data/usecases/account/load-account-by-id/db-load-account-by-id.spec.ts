import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByIdRepository } from '@data/protocols/data/account/load-by-id-repository'
import { DbLoadAccountById } from './db-load-account-by-id'

type SutTypes = {
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
  sut: DbLoadAccountById
}

const fakeResulAccount: AccountModel = {
  id: 'valid_id',
  email: 'valid_email',
  name: 'valid_name',
  password: 'valid_password',
  accessToken: 'valid_access_token',
  role: 'valid_role'
}

const makeLoadAccountByIdRepositoryStub = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById(id: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeResulAccount))
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepositoryStub()
  const sut = new DbLoadAccountById(loadAccountByIdRepositoryStub)
  return {
    sut,
    loadAccountByIdRepositoryStub
  }
}

describe('DbLoadAccountById', () => {
  test('should call LoadAccountByIdRepository with correct values', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.load('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
