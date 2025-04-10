import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comments.model.js"
import { Like } from "../models/Like.model.js"
import { Video } from "../models/video.model.js"


const getChannelStats = asyncHandler (async (req, res) => {
    // Get the channel stats like total video views total subscribers, etc

})

const getChannelVideos = asyncHandler (async (req, res) => {
    // Get all the videos uploaded by the channel

})

 export {
    getChannelStats,
    getChannelVideos
 }