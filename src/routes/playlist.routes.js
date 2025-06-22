import { Router } from "express";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatedPlaylist
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js";


 const router = Router();

 router.use(verifyJWT, upload.none());

 router.route("/").post(createPlaylist)

 router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatedPlaylist)
    .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

router.route("/user/:userId").get(getUserPlaylists);

 export default router