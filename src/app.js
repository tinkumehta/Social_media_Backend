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

export {app}