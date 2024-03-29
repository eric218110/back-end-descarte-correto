import {
  AccountTypeOrmRepository,
  connectionDatabase,
  AddAccountModel,
  Repository,
  EntityAccount
} from './account-typeorm-repository-protocols'

let accountTypeOrmRepository: Repository<EntityAccount>

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

type SutTypes = {
  sut: AccountTypeOrmRepository
  fakeAddAccountModel: AddAccountModel
}

const makeSut = (): SutTypes => {
  const fakeAddAccountModel = makeFakeAddAccountModel()
  const sut = new AccountTypeOrmRepository()
  return {
    sut,
    fakeAddAccountModel
  }
}

describe('AccountTypeOrmRepository', () => {
  beforeAll(async () => {
    const connection = await connectionDatabase.create()
    accountTypeOrmRepository = connection.getRepository(EntityAccount)
  })

  afterAll(async () => {
    await connectionDatabase.clear()
    await connectionDatabase.close()
  })

  beforeEach(async () => {
    await connectionDatabase.clear()
  })

  describe('AccountTypeOrmRepository', () => {
    describe('Add', () => {
      test('should return an account on add sucess', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        const account = await sut.add(fakeAddAccountModel)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_email@mail.com')
        expect(account.password).toBe('any_password')
      })
    })

    describe('LoadAccountByToken', () => {
      test('should return an account on loadByToken sucess', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        await accountTypeOrmRepository.insert({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          accessToken: 'any_token'
        })
        const account = await sut.loadByToken('any_token')
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(fakeAddAccountModel.name)
        expect(account.email).toBe(fakeAddAccountModel.email)
        expect(account.password).toBe(fakeAddAccountModel.password)
      })

      test('should return an account on loadByToken sucess with admin role', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        await accountTypeOrmRepository.insert({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          accessToken: 'any_token',
          role: 'admin'
        })
        const account = await sut.loadByToken('any_token', 'admin')
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(fakeAddAccountModel.name)
        expect(account.email).toBe(fakeAddAccountModel.email)
        expect(account.password).toBe(fakeAddAccountModel.password)
      })

      test('should return null on loadByToken with invalid role', async () => {
        const { sut } = makeSut()
        await accountTypeOrmRepository.insert({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          accessToken: 'any_token'
        })
        const account = await sut.loadByToken('any_token', 'admin')
        expect(account).toBeFalsy()
      })

      test('should return an account on loadByToken sucess if user is admin', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        await accountTypeOrmRepository.insert({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          accessToken: 'any_token',
          role: 'admin'
        })
        const account = await sut.loadByToken('any_token')
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(fakeAddAccountModel.name)
        expect(account.email).toBe(fakeAddAccountModel.email)
        expect(account.password).toBe(fakeAddAccountModel.password)
      })

      test('should return null if loadByToken fails', async () => {
        const { sut } = makeSut()
        const account = await sut.loadByToken('any_token')
        expect(account).toBeNull()
      })
    })

    describe('loadByEmail', () => {
      test('should return an account on loadByEmail sucess', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        await accountTypeOrmRepository.insert(fakeAddAccountModel)
        const account = await sut.loadWithEmail(fakeAddAccountModel.email)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(fakeAddAccountModel.name)
        expect(account.email).toBe(fakeAddAccountModel.email)
        expect(account.password).toBe(fakeAddAccountModel.password)
      })

      test('should return null if loadByEmail fails', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        const account = await sut.loadWithEmail(fakeAddAccountModel.email)
        expect(account).toBeNull()
      })
    })

    describe('LoadAccountById', () => {
      test('should return account if LoadById success', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        const createAccount = accountTypeOrmRepository.create(
          fakeAddAccountModel
        )
        const saveAccount = await accountTypeOrmRepository.save(createAccount)
        const account = await sut.loadById(saveAccount.id)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(saveAccount.name)
        expect(account.email).toBe(saveAccount.email)
        expect(account.password).toBe(saveAccount.password)
        expect(account.accessToken).toBe(saveAccount.accessToken)
        expect(account.role).toBe(saveAccount.role)
      })
    })

    describe('UpdateAccessToken', () => {
      test('should update the account accessToken on UpdateAccessToken success', async () => {
        const { sut, fakeAddAccountModel } = makeSut()
        const fakeAccount = await accountTypeOrmRepository.save(
          accountTypeOrmRepository.create(fakeAddAccountModel)
        )
        expect(fakeAccount.accessToken).toBeFalsy()
        await sut.updateAccessToken(fakeAccount.id, 'valid_token')
        const account = await accountTypeOrmRepository.findOne({
          id: fakeAccount.id
        })
        expect(account.accessToken).toBe('valid_token')
      })
    })
  })
})
