import { Request, Response } from "express";
import isUrl from "validator/lib/isURL";
import { nanoid } from "nanoid";
import { Url } from "../models/Url";

interface ReqBody {
  longUrl: string;
}

/**
 * Shortens a url and returns an object containing the long url, short url and url code
 * @route POST "/api"
 * @param req
 * @param res
 */
export const shortenUrl = async (req: Request, res: Response) => {
  const { longUrl }: ReqBody = req.body;
  const baseUrl = process.env.BASE_URL;

  // If baseUrl is not set
  if (!baseUrl) {
    return res.status(401).json("Internal error, base url not found");
  }
  // If baseUrl is not valid
  // require_tld: false allows "http://localhost:5000" as valid url
  if (!isUrl(baseUrl, { require_tld: false })) {
    return res.status(401).json("Internal error, invalid base url");
  }
  // If long url is not found
  if (!longUrl) {
    return res.status(400).json("No long url found");
  }
  // If long url is not valid
  if (!isUrl(longUrl)) {
    return res.status(400).json("Invalid long url");
  }

  try {
    const existingUrl = await Url.findOne({ longUrl });
    if (existingUrl) {
      const { urlCode, longUrl, shortUrl } = existingUrl;
      return res.status(200).json({
        urlCode,
        longUrl,
        shortUrl,
      });
    } else {
      const urlCode = nanoid(7);
      const shortUrl = `${baseUrl}/${urlCode}`;
      const newUrl = new Url({
        urlCode,
        longUrl,
        shortUrl,
      });
      await newUrl.save();
      return res.status(201).json({
        urlCode,
        longUrl,
        shortUrl,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Server error: ${error.message}`);
  }
};

/**
 * Gets the long url associated with the given code and redirects to it
 * @route GET "/:code"
 * @param req
 * @param res
 */
export const getLongUrl = async (req: Request, res: Response) => {
  try {
    const existingUrl = await Url.findOne({ urlCode: req.params.code });
    if (!existingUrl) {
      return res.status(404).json("No url found");
    }
    if (existingUrl.longUrl.startsWith("http")) {
      return res.redirect(existingUrl.longUrl);
    } else {
      return res.redirect(`http://${existingUrl.longUrl}`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Server error: ${error.message}`);
  }
};
