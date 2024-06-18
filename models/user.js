class UserModel {
  constructor(body) {
    const { email, name, password, photo } = body;
    this.photo = photo;
    this.email = email;
    this.name = name;
    this.password = password;
  }
}
module.exports = UserModel;
