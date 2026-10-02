import express from 'express'
import path from 'path'
import {MongoClient} from "mongodb"


const app=express()
app.use(express.urlencoded({extended:true}))

const dbName='Election_Survey'
const url="mongodb://127.0.0.1:27017"
const client=new MongoClient(url)


app.get('/',(req,resp)=>{
    const absPath=path.resolve('index.html')
    resp.sendFile(absPath)
})

app.post('/submit',async(req,resp)=>{
    await client.connect()
    const db=client.db(dbName)
    const collection=db.collection('survey_output')
    const result=await collection.insertOne(req.body)
    const absPath=path.resolve('submit.html')
    resp.sendFile(absPath)
})

app.listen(3000)