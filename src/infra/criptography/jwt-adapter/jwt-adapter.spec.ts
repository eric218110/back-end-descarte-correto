import jsonwebtoken from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

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
})
