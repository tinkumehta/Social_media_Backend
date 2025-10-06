import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "16kb"})) // sending fronted json data set limit 
app.use(express.urlencoded({extended : true, limit : "16kb"})) // encoded the url 
app.use(express.static("public")) // store the data in local folder
app.use(cookieParser())



// routes import
import userRouter from './routes/user.routes.js'
import healthCheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import commentRouter from "./routes/comment.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import subsciptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"

// routes declaration
app.get("/", (req, res) => res.send("Tinku kumar"));
app.use("/api/v1/users", userRouter)
app.use("/api/v1/health", healthCheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/subscriptions", subsciptionRouter)
app.use("/api/v1/likes", likeRouter)


// http://localhost:8000/api/v1/users/register




export {app}