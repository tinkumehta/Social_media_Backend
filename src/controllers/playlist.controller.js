import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {Playlist} from "../models/playlists.model.js"
import { Video } from "../models/video.model.js"


 const createPlaylist = asyncHandler (async (req, res) => {
    const {name, description} = req.body
    // create playlist
    if (! name || !description) {
        throw new ApiError(400, "name and description both are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user?._id,
    });

    if (!playlist) {
        throw new ApiError(500, "failed to create playlist");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "playlist created successfully")
    )
 });
  
 const getUserPlaylists = asyncHandler (async (req, res) => {
    const {playlistId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const playlistVideos = await Playlist.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "videos",
                foreignField : "_id",
                as : "videos",
            }
        },
        {
            $match : {
                "videos.isPublished" : true
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner"
            }
        },
        {
            $addFields : {
                totalVideos : {
                    $size : "$videos"
                },
                totalViews : {
                    $sum : "$videos.views"
                },
                owner : {
                    $first : "$owner"
                }
            }
        },
        {
            $project : {
                name : 1,
                description : 1,
                createdAt : 1,
                updateAt : 1,
                totalVideos : 1,
                totalViews : 1,
                videos : {
                    _id : 1,
                    "videoFile.url" : 1,
                    "thumbnail.url" : 1,
                    title: 1,
                    description : 1,
                    duration : 1,
                    createdAt : 1,
                    views : 1
                },
                owner : {
                    username : 1,
                    fullName : 1,
                    "avatar.url" : 1
                }
            }
        }
    ]);

    return res
    .status(200)
    .json (
        new ApiResponse(200, playlistVideos[0], "playlist fetched successsfully")
    )
 })

 const getPlaylistById = asyncHandler (async (req, res) => {
    const {playlistId} = req.params
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const playlistVideos = await Playlist.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "videos",
                foreignField : "_id",
                as : "videos",
            }
        },
        {
            $match : {
                "videos.isPublished" : true
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner",
            }
        },
        {
            $addFields : {
                totalVideos : {
                    $size : "$videos"
                },
                totalViews : {
                    $sum : "$videos.views"
                },
                owner : {
                    $first : "$owner"
                }
            }
        }
    ])

    return res
    .status(200)
    .json (
        new ApiResponse (200, playlistVideos[0], "playlist fetched successfully")
    )
 })

 const addVideoToPlaylist = asyncHandler (async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid PlaylistId or videoId");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!video) {
        throw new ApiError(404, "video not found")
    }
    if (
        (playlist.owner?.toString() && video.owner.toString()) !== 
        req.user?._id.toString()) {
        throw new ApiError(400, "only owner can add video to thier playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $addToSet : {
                videos : videoId,
            }
        },
        {new : true}
    )

    if (!updatedPlaylist) {
        throw new ApiError(
            400,
            "failed to add video to playlist please try again"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Added video to playlist successfully"
        )
    )
 })

 const removeVideoFromPlaylist = asyncHandler (async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(404, "Playlist not found")
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (!video) {
        throw new ApiError(404, "video not found");
    }

    if (
        (playlist.owner?.toString() && video.owner.toString()) !==
        req.user?._id.toString()
    ) {
        throw new ApiError(
            404,
            "only owner can remove video from thier playlist"
        );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull : {
                videos : videoId,
            },
        },
        { new : true}
    );

    return res
    .status(200)
    .json(
        new ApiResponse (
            200,
            updatedPlaylist,
            "Removed video from playlist successfully"
        )
    );
 });

 const deletePlaylist = asyncHandler (async (req, res) => {
    const {playlistId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can delete the playlist")
    }

    await Playlist.findByIdAndDelete(playlist?._id);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {},
            "playlist updated successfully"
        )
    )
 })

 const updatedPlaylist = asyncHandler (async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if (! name || !description) {
        throw new ApiError(400, "name and description both are required")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit the playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $set : {
                name,
                description,
            },
        },
        {new : true}
    );

    return res
    .status(200)
    .json (
        new ApiResponse(
            200,
            updatedPlaylist,
            "playlist updated successfully"
        )
    )
 })

 export {
    createPlaylist,
    updatedPlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylistById,
    getUserPlaylists
 }