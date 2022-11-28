# url-shortener

This is an API that shortens the provided url.

## Get started

### To Install

**You can clone the project:**

```bash
git clone https://github.com/ViaxCo/url-shortener.git
```

**Install dependencies:**

```bash
npm install
```

**Create a `.env` file in the root of the project for this environment variable:**

```
MONGO_URI=
```

- `MONGO_URI` is the uri for your MongoDB database.

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
    "longUrl": "https://www.google.com/search?q=url&rlz=1C5CHFA_enNG999NG999&oq=url&aqs=chrome..69i57j35i39l2j0i433i512j0i512j69i60l3.1212j0j9&sourceid=chrome&ie=UTF-8"
}
```

It should return an object that looks like this:

```json
{
  "urlCode": "sRmqY44",
  "shortUrl": "http://localhost:5000/sRmqY44"
}
```

If the API was hosted on this domain: `"sh.rt"` for example, the response would have a `shortUrl` that looks like this:

```json
{
  "shortUrl": "https://sh.rt/sRmqY44"
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
  "test": "mocha -r ts-node/register -r dotenv/config ./src/test/**/*.test.ts --timeout 600000"
}
```

The test is run with mocha and it uses an in-memory MongoDB server to mock the database, therefore, before the test starts, the `mongodb-memory-server-core` package downloads the latest MongoDB binaries and saves them to a cache folder in `./node_modules`.

- Running with `ts-node/register` because the test file is written in typescript.

- Running with `dotenv/config` to load environment variables.

- Running with `--timeout 600000` to allow for the test to wait for a delay of 10 minutes before failing if the test takes too long.(This is needed to allow the MongoDB binaries to download on slow connections)

### To build for production

```bash
npm run build
```

- Live implementation of the API: [Shorten](https://viaxco-shorten.herokuapp.com/)

- API Documentation: [URL Shortener](https://documenter.getpostman.com/view/13046478/TWDdiDK5)

- Demo of the API with a frontend application: [Url Shortener](https://viaxco-url-shortener.netlify.app/)
