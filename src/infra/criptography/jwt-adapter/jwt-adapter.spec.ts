import jsonwebtoken from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('valid_token'))
  },
  async verify (token: string): Promise<string> {
    return new Promise(resolve => resolve('decrypted_value'))
  }
}))

type SutTypes = {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret')
  return {
    sut
  }
}

describe('JwtAdapter', () => {
  describe('sign()', () => {
    test('should call jwt sign with correct values', async () => {
      const { sut } = makeSut()
      const spySign = jest.spyOn(jsonwebtoken, 'sign')
      await sut.encrypt('any_id')
      expect(spySign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('should return token if jwt sign success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('valid_token')
    })

    test('should throws jwt sign throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jsonwebtoken, 'sign')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const { sut } = makeSut()
      const verifySpy = jest.spyOn(jsonwebtoken, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('should return a value on verify success', async () => {
      const { sut } = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('decrypted_value')
    })
  })
})
