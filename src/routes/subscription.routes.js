import { Router } from "express";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubcription
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();

router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(getSubscribedChannels)
    .post (toggleSubcription);

router.route("/u/:subscribedId").get(getUserChannelSubscribers)

export default router;