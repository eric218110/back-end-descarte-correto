import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadByEmailRepository } from '../../../data/protocols/data/load-by-email-repository'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

const makeFakeAccout = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_mail@mail.com',
  name: 'valid_name',
  password: 'valid_hashed_password'
})

const makeFakeRequest = (): AuthenticationModel => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

interface SutTypes {
  sut: Authentication
  loadByEmailRepositoryStub: LoadByEmailRepository
  hashCompareStub: HashCompare
  tokenGeneratorStub: TokenGenerator
  fakeRequest: AuthenticationModel
  fakeAccout: AccountModel
}

const makeLoadByEmailRepositoryStub = (): LoadByEmailRepository => {
  class LoadByEmailRepositoryStub implements LoadByEmailRepository {
    async loadWithEmail (email: string): Promise<AccountModel> {
      return makeFakeAccout()
    }
  }
  return new LoadByEmailRepositoryStub()
}

const makeHashCompareStub = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (hash: string, compareHash: string): Promise<boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return 'valid_token'
    }
  }
  return new TokenGeneratorStub()
}

const makeSut = (): SutTypes => {
  const loadByEmailRepositoryStub = makeLoadByEmailRepositoryStub()
  const hashCompareStub = makeHashCompareStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const sut = new DbAuthentication(
    loadByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
  )
  const fakeRequest = makeFakeRequest()
  const fakeAccout = makeFakeAccout()
  return {
    sut,
    loadByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    fakeRequest,
    fakeAccout
  }
}

describe('DbAuthenticate use case', () => {
  test('should call LoadByEmailRepository with email correct', async () => {
    const { sut, loadByEmailRepositoryStub, fakeRequest } = makeSut()
    const spyloadWithEmail = jest.spyOn(loadByEmailRepositoryStub, 'loadWithEmail')
    await sut.auth(fakeRequest)
    expect(spyloadWithEmail).toHaveBeenCalledWith(fakeRequest.email)
  })

  test('should throws if LoadByEmailRepository throws', async () => {
    const { sut, loadByEmailRepositoryStub, fakeRequest } = makeSut()
    jest.spyOn(loadByEmailRepositoryStub, 'loadWithEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.auth(fakeRequest)
    await expect(response).rejects.toThrow()
  })

  test('should return null if LoadByEmailRepository return null', async () => {
    const { sut, loadByEmailRepositoryStub, fakeRequest } = makeSut()
    jest.spyOn(loadByEmailRepositoryStub, 'loadWithEmail').mockReturnValueOnce(null)
    const accessToken = await sut.auth(fakeRequest)
    expect(accessToken).toBeNull()
  })

  test('should call HashCompare with email correct values', async () => {
    const { sut, hashCompareStub, fakeRequest, fakeAccout } = makeSut()
    const spyCompare = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(fakeRequest)
    expect(spyCompare).toHaveBeenCalledWith(fakeRequest.password, fakeAccout.password)
  })

  test('should throws if HashCompare throws', async () => {
    const { sut, hashCompareStub, fakeRequest } = makeSut()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.auth(fakeRequest)
    await expect(response).rejects.toThrow()
  })

  test('should return null if HashCompare return false', async () => {
    const { sut, hashCompareStub, fakeRequest } = makeSut()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(fakeRequest)
    expect(accessToken).toBeNull()
  })

  test('should call TokenGenerator with email correct values', async () => {
    const { sut, tokenGeneratorStub, fakeRequest, fakeAccout } = makeSut()
    const spyGenerate = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(fakeRequest)
    expect(spyGenerate).toHaveBeenCalledWith(fakeAccout.id)
  })
})
