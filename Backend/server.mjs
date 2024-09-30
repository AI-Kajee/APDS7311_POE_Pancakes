import express from "express";

const PORT = 3000;
const app = express();
const urlprefix = '/api'

app.use(express.json());

app.get(urlprefix+'/',(req, res)=>{
    res.send('So and so')
})

app.get(urlprefix+'/pancakes',(req, res)=>{
    const stack = [
        {
            id: "1",
            name: "stack of pancakes"
        }
    ]
    res.json(
        {
            message: "Pancake",
            stack: stack
        }
    )
})

app.listen(PORT)