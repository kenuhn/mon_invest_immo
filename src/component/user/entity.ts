export type NewUser = {
  email: string;
  password: string;
};

export type ExistingUser = NewUser & {
  id: string;
};

export interface IUserEntity {
  id: string;
  email: string;
  password: string;
  getRegister(): ExistingUser;
}

export class UserEntity implements IUserEntity {
  id: string;
  email: string;
  password: string;

  constructor(id: string, email: string, password: string) {
    this.id = id;
    this.email = this.#setEmail(email);
    this.password = password;
  }

  getRegister() {
    return { id: this.id, email: this.email, password: this.password };
  }

  #setEmail(email: string) {
    if (this.#validateEmail(email)) {
      this.email = email;
      return this.email;
    }

    throw new Error("Bad email");
  }

  #validateEmail(email: string) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isValide = emailRegex.test(email);
    if (isValide) {
      return true;
    }
    return false;
  }
}
