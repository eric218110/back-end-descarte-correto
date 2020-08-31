import { DbAuthentication } from './db-authentication'
import {
  Authentication,
  AuthenticationModel,
  AccountModel,
  HashCompare,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authenticate-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_mail@mail.com',
  name: 'valid_name',
  password: 'valid_hashed_password',
  accessToken: 'valid_access_token',
  role: 'valid_role'
})

const makeFakeRequest = (): AuthenticationModel => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

const fakeToken: string = 'valid_token'

type SutTypes = {
  sut: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  fakeRequest: AuthenticationModel
  fakeAccout: AccountModel
  fakeToken: string
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadWithEmail (email: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompareStub = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (hash: string, compareHash: string): Promise<boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

const makeTokenGeneratorStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return fakeToken
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashCompareStub = makeHashCompareStub()
  const encrypterStub = makeTokenGeneratorStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  const fakeRequest = makeFakeRequest()
  const fakeAccout = makeFakeAccount()
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    fakeRequest,
    fakeAccout,
    fakeToken
  }
}

describe('DbAuthenticate use case', () => {
  test('should call LoadAccountByEmailRepository with email correct', async () => {
    const { sut, loadAccountByEmailRepositoryStub, fakeRequest } = makeSut()
    const spyloadWithEmail = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadWithEmail')
    await sut.auth(fakeRequest)
    expect(spyloadWithEmail).toHaveBeenCalledWith(fakeRequest.email)
  })

  test('should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub, fakeRequest } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadWithEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.auth(fakeRequest)
    await expect(response).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub, fakeRequest } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadWithEmail').mockReturnValueOnce(null)
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

  test('should call Encrypter with correct email', async () => {
    const { sut, encrypterStub, fakeRequest, fakeAccout } = makeSut()
    const spyGenerate = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(fakeRequest)
    expect(spyGenerate).toHaveBeenCalledWith(fakeAccout.id)
  })

  test('should throws if Encrypter throws', async () => {
    const { sut, encrypterStub, fakeRequest } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.auth(fakeRequest)
    await expect(response).rejects.toThrow()
  })

  test('should return accessToken if Encrypter encrypt correct toke with id valid', async () => {
    const { sut, fakeRequest, fakeToken } = makeSut()
    const accessToken = await sut.auth(fakeRequest)
    expect(accessToken).toBe(fakeToken)
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositoryStub,
      fakeRequest,
      fakeAccout,
      fakeToken
    } = makeSut()
    const spyUpdate = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(fakeRequest)
    expect(spyUpdate).toHaveBeenCalledWith(fakeAccout.id, fakeToken)
  })

  test('should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub, fakeRequest } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.auth(fakeRequest)
    await expect(response).rejects.toThrow()
  })
})
