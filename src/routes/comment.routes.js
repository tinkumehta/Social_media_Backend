import { Router } from "express";
import {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
} from "../controllers/comment.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.use(verifyJWT, upload.none());

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)

export default router