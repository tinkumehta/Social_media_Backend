import { Router } from "express";
import {getChannelVideos, getChannelStats} from "../controllers/dashboard.controller.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

 const router = Router();

 router.use(verifyJWT);

 router.route("/stats").get(getChannelStats);
 router.route("/videos").get(getChannelVideos)

 export default router