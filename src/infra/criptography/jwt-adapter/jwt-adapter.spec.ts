import jsonwebtoken from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('valid_token'))
  }
}))

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret')
  return {
    sut
  }
}

describe('JwtAdapter', () => {
  test('should call jwt sign with correct values', async () => {
    const { sut } = makeSut()
    const spySign = jest.spyOn(jsonwebtoken, 'sign')
    await sut.encript('any_id')
    expect(spySign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('should return token if jwt sign success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.encript('any_id')
    expect(accessToken).toBe('valid_token')
  })

  test('should throws jwt sign throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jsonwebtoken, 'sign')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.encript('any_id')
    await expect(promise).rejects.toThrow()
  })
})
