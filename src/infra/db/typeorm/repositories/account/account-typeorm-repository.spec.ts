import { connectionDatabase } from '../../utils/create-connections'
import { AddAccountModel } from '@domain/usecases/account/add-account'
import { AccountTypeOrmRepository } from './account-typeorm-repository'

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

type SutTypes = {
  sut: AccountTypeOrmRepository
  fakeAddAccountModel: AddAccountModel
}

const makeSut = (): SutTypes => {
  const fakeAddAccountModel = makeFakeAddAccountModel()
  const sut = new AccountTypeOrmRepository()
  return {
    sut,
    fakeAddAccountModel
  }
}

describe('AccountTypeOrmRepository', () => {
  beforeAll(async () => {
    await connectionDatabase.create()
    console.log('Connected database in mode: ' + process.env.MODE)
  })

  afterAll(async () => {
    await connectionDatabase.clear()
    await connectionDatabase.close()
  })

  beforeEach(async () => {
    await connectionDatabase.clear()
  })

  describe('Add', () => {
    test('should return an account on add sucess', async () => {
      const { sut, fakeAddAccountModel } = makeSut()
      const account = await sut.add(fakeAddAccountModel)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
})
