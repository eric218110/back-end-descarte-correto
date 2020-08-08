import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encript'
import { AddAccountModel } from '../../../domain/usecases/add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encript (value: string): Promise<string> {
      return new Promise(resolve => resolve('hased_password'))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount', () => {
  test('should call encripty with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encriptSpy = jest.spyOn(encrypterStub, 'encript')
    const accountData: AddAccountModel = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encriptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('should throws to encripty throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encript')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accountData: AddAccountModel = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promisse = sut.add(accountData)
    await expect(promisse).rejects.toThrow()
  })
})
