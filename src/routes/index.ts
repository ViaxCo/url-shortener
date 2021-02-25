import express from "express";
const router = express.Router();
import { getLongUrl, shortenUrl } from "../controllers/url";

router.route("/api").post(shortenUrl);
router.route("/:code").get(getLongUrl);

export default router;
