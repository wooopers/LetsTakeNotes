const express = require("express");
const path = require("path");
const fs = require("fs");
// const api = require("./routes/apiRoutes");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api", api);

app.use(express.static("public"));
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (error){
            console.log(error)
        }
        res.json(JSON.parse(data))
    })
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
);