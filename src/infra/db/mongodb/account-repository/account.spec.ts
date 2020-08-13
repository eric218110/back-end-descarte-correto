import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

let accountCollection: Collection

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

interface SutTypes {
  sut: AccountMongoRepository
  fakeAddAccountModel: AddAccountModel
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): SutTypes => {
    const fakeAddAccountModel = makeFakeAddAccountModel()
    const sut = new AccountMongoRepository()
    return {
      sut,
      fakeAddAccountModel
    }
  }

  test('should return an account on add sucess', async () => {
    const { sut, fakeAddAccountModel } = makeSut()
    const account = await sut.add(fakeAddAccountModel)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return an account on loadByEmail sucess', async () => {
    const { sut, fakeAddAccountModel } = makeSut()
    await accountCollection.insertOne(fakeAddAccountModel)
    const account = await sut.loadWithEmail(fakeAddAccountModel.email)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(fakeAddAccountModel.name)
    expect(account.email).toBe(fakeAddAccountModel.email)
    expect(account.password).toBe(fakeAddAccountModel.password)
  })

  test('should return null if loadByEmail fails', async () => {
    const { sut, fakeAddAccountModel } = makeSut()
    const account = await sut.loadWithEmail(fakeAddAccountModel.email)
    expect(account).toBeFalsy()
  })
})
