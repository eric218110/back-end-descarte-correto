import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encript'
import { AddAccountModel } from '../../../domain/usecases/add-account'

describe('DbAddAccount', () => {
  test('should call encripty with correct password', async () => {
    class EncriptStub implements Encrypter {
      async encript (value: string): Promise<string> {
        return new Promise(resolve => resolve('hased_password'))
      }
    }
    const encriptStub = new EncriptStub()
    const sut = new DbAddAccount(encriptStub)
    const encriptSpy = jest.spyOn(encriptStub, 'encript')
    const accountData: AddAccountModel = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encriptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
