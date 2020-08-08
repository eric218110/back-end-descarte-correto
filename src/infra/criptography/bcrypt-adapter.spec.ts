import bcrypt from 'bcrypt'
import { BCryptAdapter } from './brcypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hashed_value'))
  }
}))

describe('BCryptAdapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encript('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash on sucess', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hash = await sut.encript('any_value')
    expect(hash).toBe('hashed_value')
  })
})
