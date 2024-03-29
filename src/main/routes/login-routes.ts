import { Router } from 'express'
import { addpterRoute } from '@main/adapters/express/express-route-adapter'
import { makeSignUpController } from '@main/factories/controllers/account/signup/signup-controller-factory'
import { makeLoginController } from '@main/factories/controllers/account/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', addpterRoute(makeSignUpController()))
  router.post('/login', addpterRoute(makeLoginController()))
}
