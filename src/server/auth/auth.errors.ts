import "server-only";

export class AuthenticationRequiredError extends Error {
  constructor(message = "Authentication is required") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

export class AuthorizationDeniedError extends Error {
  constructor(message = "Admin permission is required") {
    super(message);
    this.name = "AuthorizationDeniedError";
  }
}