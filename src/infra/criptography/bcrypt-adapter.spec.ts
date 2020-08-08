import bcrypt from 'bcrypt'
import { BCryptAdapter } from './brcypt-adapter'

describe('BCryptAdapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encript('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
