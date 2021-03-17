import { Request, Response } from "express";
import isUrl from "validator/lib/isURL";
import { nanoid } from "nanoid";
import { Url } from "../models/Url";

interface ReqBody {
  longUrl: string;
}

/**
 * Shortens a url and returns an object containing the short url and url code
 * @route POST "/api"
 * @param req
 * @param res
 */
export const shortenUrl = async (req: Request, res: Response) => {
  const { longUrl }: ReqBody = req.body;
  // Get the hostname of the server
  const host = req.headers.host;
  // Use it to construct a baseUrl
  const baseUrl = process.env.NODE_ENV !== "production" ? `http://${host}` : `https://${host}`;

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
      const { urlCode } = existingUrl;
      return res.status(200).json({
        urlCode,
        shortUrl: `${baseUrl}/${urlCode}`,
      });
    } else {
      // Check if urlCode already exists
      let urlCode = "";
      while (!urlCode) {
        const newUrlCode = nanoid(7);
        const urlExists = await Url.findOne({ urlCode: newUrlCode });
        if (!urlExists) {
          urlCode = newUrlCode;
        }
      }
      const newUrl = new Url({
        urlCode,
        longUrl,
      });
      await newUrl.save();
      return res.status(200).json({
        urlCode,
        shortUrl: `${baseUrl}/${urlCode}`,
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
