import bcrypt from 'bcrypt'
import { BCryptAdapter } from './brcypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hashed_value'))
  }
}))

interface MakeTypes {
  salt: number
  sut: BCryptAdapter
}

const makeSut = (): MakeTypes => {
  const salt = 12
  const sut = new BCryptAdapter(salt)
  return {
    salt,
    sut
  }
}

describe('BCryptAdapter', () => {
  test('should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encript('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash on sucess', async () => {
    const { sut } = makeSut()
    const hash = await sut.encript('any_value')
    expect(hash).toBe('hashed_value')
  })

  test('should throws bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.encript('any_value')
    await expect(promise).rejects.toThrow()
  })
})
