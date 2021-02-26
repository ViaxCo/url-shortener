# spleet-url-shortener

This is an api that shortens the provided url.

## Get started

### To Install

**You can clone the project:**

```bash
git clone https://github.com/ViaxCo/spleet-url-shortener.git
```

**Install dependencies:**

```bash
npm install
```

**Create a `.env` file in the root of the project for these environment variables:**

```
MONGO_URI=
BASE_URL=http://localhost:5000
```

- `MONGO_URI` is the uri for your MongoDB database.

- `BASE_URL` is the url of the domain that the server runs on, and for development, it should be `http://localhost:5000`

### To run the server in development

```bash
npm run dev
```

The endpoint to send long urls to be shortened is `"/api"`.
For example:

```http
POST http://localhost:5000/api
Content-Type: application/json

{
    "longUrl": "google.com"
}
```

It should return an object that looks like this:

```json
{
  "urlCode": "sRmqY44",
  "longUrl": "google.com",
  "shortUrl": "http://localhost:5000/sRmqY44"
}
```

If the api was hosted on this domain: `"sh.rt"` for example, and it was also specified as the `BASE_URL`, the response would have `shortUrl` like so:

```json
{
  "shortUrl": "sh.rt/sRmqY44"
}
```

A request made to the short url should redirect you to the long url.

### To run tests

```bash
npm test
```

This runs the script:

```json
{
  "test": "mocha -r ts-node/register -r dotenv/config ./src/test/**/*.test.ts --timeout 10000 --exit"
}
```

The test is run with mocha.

- Running with `ts-node/register` because the test file is written in typescript.

- Running with `dotenv/config` to load environment variables.

- Running with `--timeout 10000` to allow for the test to wait for a delay of 10 seconds before failing if the test takes too long. This is necessary because of connections to a remote database.

- `--exit` to exit after the test is completed.

### To build for production

```bash
npm run build
```

- Live implementation of the api: [Spleet Shorten](https://spleet-shorten.herokuapp.com/)

- Demo of the api with a frontend application: [Url Shortener](https://viaxco-spleet-url-shortener.netlify.app/)
