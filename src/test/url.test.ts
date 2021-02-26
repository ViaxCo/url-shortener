//During the test the NODE_ENV variable is set to test
process.env.NODE_ENV = "test";

import mongoose from "mongoose";
// In-memory MongoDB database for testing
import { MongoMemoryServer } from "mongodb-memory-server";
let mongoServer: MongoMemoryServer;

import { Url } from "../models/Url";

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";

chai.should();
chai.use(chaiHttp);

describe("Url", () => {
  // Provide a valid url to test with
  const validLongUrl = "https://twitter.com";
  let urlCode: string;

  before(async () => {
    // Initiate connection to databse
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`CONNECTED to database on: ${conn.connection.host}`);
  });

  after(async () => {
    // After the test ends, drop the databse and disconnect from it
    await Url.db.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("Test ended...database deleted");
  });

  // Test the POST route
  describe("POST /api", () => {
    it("It should create a new short url", done => {
      chai
        .request(server)
        .post("/api")
        .send({ longUrl: validLongUrl })
        .end((err, res) => {
          res.should.have.status(201);
          urlCode = res.body.urlCode;
          done();
        });
    });
    it("It should return an existing short url", done => {
      chai
        .request(server)
        .post("/api")
        .send({ longUrl: validLongUrl })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("It should not create a short url with an invalid long url", done => {
      chai
        .request(server)
        .post("/api")
        .send({ longUrl: "https://twittercom" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql("Invalid long url");
          done();
        });
    });
  });

  // Test the GET route
  describe("GET /:code", () => {
    it("It should redirect to the long url", done => {
      chai
        .request(server)
        .get(`/${urlCode}`)
        .redirects(0)
        .end((err, res) => {
          res.should.have.status(302);
          res.should.redirectTo(validLongUrl);
          done();
        });
    });
    it("It should return error if url not found for given code", done => {
      chai
        .request(server)
        .get("/invalid-code")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.eql("No url found");
          done();
        });
    });
  });
});
