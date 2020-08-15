import bcrypt from 'bcrypt'
import { BCryptAdapter } from './brcypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hashed_value'))
  },
  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

type MakeTypes = {
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
  test('should call bcrypt hash with correct values', async () => {
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

  test('should throws bcrypt hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.encript('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('should call bcrypt compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'hashed_value')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'hashed_value')
  })

  test('should throws bcrypt compare throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.compare('any_value', 'hashed_value')
    await expect(promise).rejects.toThrow()
  })

  test('should return a false if bcrypt compare fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const isEquals = await sut.compare('any_value', 'hashed_value')
    expect(isEquals).toBe(false)
  })

  test('should return a true if bcrypt compare on sucess', async () => {
    const { sut } = makeSut()
    const isEquals = await sut.compare('any_value', 'hashed_value')
    expect(isEquals).toBe(true)
  })
})
