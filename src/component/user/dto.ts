export type LoginDTOType = {
  email: string;
  password: string;
};

export interface ILoginDTO {
  loginObj: LoginDTOType;

  isValidateEmail(email: string): boolean;
  setEmail(): string;
  isValidePassword(password: string): boolean;
  setPassword(): string;
}

export class LoginDTO implements ILoginDTO {
  loginObj: LoginDTOType;
  constructor(loginObj: LoginDTOType) {
    this.loginObj = loginObj;
  }

  setEmail() {
    if (this.isValidateEmail(this.loginObj.email)) {
      return this.loginObj.email;
    }
    throw new Error("Bad email");
  }

  isValidateEmail(email: string) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isValide = emailRegex.test(email);
    if (isValide) {
      return true;
    }
    return false;
  }

  isValidePassword(password: string): boolean {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  }

  setPassword(): string {
    if (this.isValidePassword(this.loginObj.password)) {
      return this.loginObj.password;
    }
    throw new Error("Password not valid");
  }
}
