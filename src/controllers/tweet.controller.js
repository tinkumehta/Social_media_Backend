import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {Tweet} from "../models/tweets.model.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body;
    if (!content) {
        throw new ApiError(401, "content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new Error(500, "Tweet does not create")
    }

    return res
    .status(200)
    .json(
        new ApiResponse (200, tweet, "tweet create is successfully")
    )
})

const getUserTweet = asyncHandler(async (req, res) => {
    // access userId from req parms
    // check valided of userid 
    // mongoose arrgegate, piplen
    // first arrgegate for user and second likes
    // check user like and unlike
    // project details
    // resturn response

    const {userId} = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User id not be valid")
    }

    const tweet = await Tweet.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerDetails",
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            "avatar.url" : 1,
                        }
                    },
                ],
            }
        },
        {
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField : "tweet",
                as : "likeDetails",
                pipeline : [
                    {
                        $project : {
                            likedBy : 1,
                        }
                    },
                ],
            }
        },
        {
            $addFields : {
                likesCount : {
                    $size : "$likeDetails"
                },
                ownerDetails : {
                    $first : "$ownerDetails"
                },
                isLiked : {
                    $cond : {
                        if : {$in : [req.user?._id, "$likeDetails.likedBy"]},
                        then : true,
                        else : false
                    }
                }
            },
        },
        {
            $sort : {
                createdAt : -1
            }
        },
        {
            $project : {
                content : 1,
                ownerDetails : 1,
                likesCount : 1,
                createdAt : 1,
                isLiked : 1,
            }
        },

    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweets fetched successfully")
    );
})

const updateTweet = asyncHandler (async (req, res) => {
    const {content} = req.body;
    const {tweetId} = req.params;

    if (!content) {
        throw new ApiError(400, "content is required")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "only owner can edit thier tweet")
    }

    const newTweet = await Tweet.findByIdAndUpdate(
       // tweet,
       tweetId,
        {
            $set : {
                content
            }
        },
        {new : true},
    );

    if (!newTweet) {
        throw new ApiError(500, "Failed to tweet updated ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newTweet, "Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler (async (req, res) => {
    const {tweetId} = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweet = await Tweet.findById(tweetId);

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can delete their tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);  //tweet

    return res
    .status(200)
    .json(
        new ApiResponse(200, {tweet}, "Tweet deleted successfully")
    )
})


export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}