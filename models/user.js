class UserModel {
  constructor(body) {
    const { email, name, password } = body;

    this.email = email;
    this.name = name;
    this.password = password;
  }
}
module.exports = UserModel;
