import { Router } from "express";
import { 
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweet
 } from "../controllers/tweet.controller.js";

import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router()

router.use(verifyJWT, upload.none());

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweet);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet)

export default router;