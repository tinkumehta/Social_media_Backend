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

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/health", healthCheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/video", videoRouter)

// http://localhost:8000/api/v1/users/register




export {app}