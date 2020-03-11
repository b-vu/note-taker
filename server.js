const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path");

const writefileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notes = require("./db.json")
let counter;

if(notes.length){
    counter = notes[notes.length - 1].id;
}
else{
    counter = -1;
}

//Get Routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "notes.html"));
})

app.get("/api/notes", (req, res) => {
    return res.json(notes);
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

//Post Routes
app.post("/api/notes", (req, res) => {
    const note = req.body;
    counter++;
    note.id = counter;
    console.log(note);
    notes.push(note);
    writefileAsync(__dirname + "/db.json", JSON.stringify(notes, null, 2))
    .then(res.json(notes));
})

app.post("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    for(let i = 0; i < notes.length; i++){
        if(notes[i].id === id){
            notes.splice(i, 1);
        }
    };
    
    writefileAsync(__dirname + "/db.json", JSON.stringify(notes, null, 2))
    .then(res.json(notes));
})

//Server listening
app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});