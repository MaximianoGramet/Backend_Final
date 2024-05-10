export default class UserDto {
  constructor(user) {
    this._id = user._id;
    this.full_name = `${user.name} ${user.last_name}`;
    this.email = user.email;
    this.age = user.age;
    this.rol = user.rol;
    this.cart = user.cart;
  }
}
