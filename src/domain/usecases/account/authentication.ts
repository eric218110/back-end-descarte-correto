export type AuthenticationModel = {
  email: string
  password: string
}

export type AuthenticationModelResponse = {
  accessToken: string
  email: string
  name: string
  role: string
}

export interface Authentication {
  auth: (
    authentication: AuthenticationModel
  ) => Promise<AuthenticationModelResponse>
}
