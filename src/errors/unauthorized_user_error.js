class UnauthorizedUserError extends Error {
  constructor (name, email) {
    super(`${name} <${email}>`)
    this.name = name
    this.email = email
  }
}

export default UnauthorizedUserError
