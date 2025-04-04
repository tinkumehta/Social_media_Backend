import { Router } from "express";
import { 
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweet
 } from "../controllers/tweet.controller.js";

import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router()

router.use(verifyJWT);

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweet);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet)

export default router;