import { Router } from "express";
import { 
    getAllVideos ,
    updateVideo,
    deleteVideo,
    publishAVideo,
    togglePublishStatus,
    getVideoById
} from "../controllers/video.controllers.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();



router.route("/")
.get(getAllVideos)
.post(
    verifyJWT,
    upload.fields([
        {
            name : "videoFile",
            maxCount : 1
        },
        {
            name : "thumbnail",
            maxCount : 1
        }
    ]),
    publishAVideo
);

router
.route("/v/:videoId")
.get(verifyJWT, getVideoById)
.delete(verifyJWT, deleteVideo)
.patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus)


export default router;