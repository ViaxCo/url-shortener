//During the test the NODE_ENV variable is set to test
process.env.NODE_ENV = "test";

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
    //Before the test starts, empty the database
    await Url.deleteMany({});
    console.log("Test started...database cleared");
  });

  after(async () => {
    // After the test ends, delete the database
    await Url.db.dropDatabase();
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
