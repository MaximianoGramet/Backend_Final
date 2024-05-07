import { expect } from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";
import bcrypt from "bcrypt";

const ADMIN_NAME = config.adminName;
const ADMIN_PASSWORD = config.adminPassword;

const requester = supertest("http://localhost:8080");

let createdUser;

describe("Testing Auth Endpoints", () => {
  describe("Create a new account", () => {
    it("Register account successfully using email and password", async function () {
      const mockUser = {
        first_name: "John",
        last_name: "Test",
        email: "test@example.com",
        age: 55,
        password: "test1234",
      };

      const { statusCode, body } = await requester
        .post("/api/sessions/register")
        .send(mockUser);

      expect(statusCode).is.equals(200);
      expect(body.msg).is.equals("User created");
      expect(body.status).is.equals("success");

      createdUser = body.data;
    });

    it("The password should be stored encrypted", async function () {
      const response = await requester
        .post(`/api/sessions/find-user/${createdUser._id}`)
        .send({ createdUser });
      expect(response.body.password).to.not.equal("test1234");
      const isMatch = await bcrypt.compare("test1234", response.body.password);
      expect(isMatch).is.equal(true);
    });

    it("New user should have 'user' role", async function () {
      expect(createdUser.rol).to.be.equals("user");
      expect(createdUser.rol).to.be.a("string");
    });
  });

  describe("Login user", () => {
    it("Login user successfully using valid credentials", async function () {
      const mockUser = {
        email: "test@example.com",
        password: "test1234",
      };

      const { statusCode, body } = await requester
        .post("/api/sessions/login")
        .send(mockUser);
      expect(statusCode).is.equals(200);
      expect(body.status).is.equals("success");
    });

    it("Login user failed with invalid credentials", async function () {
      const mockUser = {
        email: "test@example.com",
        password: "test123456",
      };

      const { body } = await requester
        .post("/api/sessions/login")
        .send(mockUser);

      expect(body.status).is.not.equals("success");
    });

    describe("Delete user", () => {
      it("Logout from user account", async function () {
        const response = await requester.get("/api/sessions/logout");
        expect(response.status).to.equal(200);
      });

      it("Login as admin", async function () {
        const adminUser = {
          email: ADMIN_NAME,
          password: ADMIN_PASSWORD,
        };

        const { statusCode, body } = await requester
          .post("/api/sessions/login")
          .send(adminUser);
        expect(statusCode).to.equal(200);
      });

      it("Delete user successfully", async function () {
        const { statusCode, body } = await requester.delete(
          `/api/sessions/delete-user/${createdUser._id}`
        );

        expect(statusCode).is.equals(200);
        expect(body.status).is.equals("success");
        expect(body.msg).is.equals("User deleted successfully");
      });

      it("Logout from admin account", async function () {
        const response = await requester.get("/api/sessions/logout");
        expect(response.status).to.equal(200);
      });
    });
  });
});
describe("Testing Cart Endpoints", () => {
  describe("Testing Cart api", () => {
    it("Testeando el crear un carrito en la ruta /api/carts/", async () => {
      const { statusCode, ok } = await requester.post("/api/carts");
      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
    });

    it("Testeando el traer todos los carritos con /api/carts", async () => {
      const { statusCode, ok, body } = await requester.get("/api/carts");
      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
      expect(body).to.be.an("object");
      expect(body.data).to.be.an("array");
      expect(body.data.length).to.be.greaterThan(0);
    });

    it("Testeando el traer un carrito especifico por id con /api/carts/:cid", async () => {
      const cid = "65e365e5b5cbca290fd09647";

      const response = await requester.get(`/api/carts/${cid}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body.cart).to.exist;
      expect(response.body.cart._id).to.equal(cid);
    });
  });
});

describe("Testing Product Endpoints", () => {
  let newProduct;
  describe("Create a new product", () => {
    it("Create a new product with all information neccesary", async function () {
      const mockProduct = {
        title: "Test product",
        description: "Description for a random test product",
        price: 100,
        thumbnail: "No image",
        code: "TEST01",
        stock: 10,
        status: true,
        owner: "test",
      };

      const response = await requester.post("/api/products").send(mockProduct);
      expect(response.statusCode).is.equals(201);
      expect(response.ok).is.equals(true);
      expect(response._body.product).to.not.be.empty;

      newProduct = response._body.product;
    });

    it("Fail to create a new product with missing properties", async function () {
      const mockProduct = {
        thumbnail: "Sin imagen",
        category: "Test",
        code: "TEST02",
        stock: 10,
        status: true,
      };

      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(mockProduct);

      expect(statusCode).is.equals(400);
      expect(ok).is.equals(false);
      expect(_body.error).is.equals("Product creation error");
    });
  });

  describe("Get products", () => {
    it("Get all products", async function () {
      const { response, body, statusCode } = await requester.get(
        "/api/products"
      );

      expect(statusCode).is.equals(200);
      expect(body.data.length).to.be.greaterThan(0);
    });

    it("Get product by ID", async function () {
      const { statusCode, ok, _body } = await requester.get(
        `/api/products/${newProduct._id}`
      );

      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
      expect(_body.product).to.not.be.empty;
    });
  });

  describe("Delete a product", () => {
    it("Delete a product with a valid ProductID", async function () {
      const response = await requester.delete(
        `/api/products/${newProduct._id}`
      );
      expect(response.statusCode).is.equals(200);
      expect(response.ok).is.equals(true);
      expect(response._body.message).is.equals("Product deleted successfully");
    });
  });
});
