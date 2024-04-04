const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

// ROUTE 1 : Get All Notes  Using: GET "/api/notes/createuser" . login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("interenal server error");
  }
});
// ROUTE 2 : add a New Note  Using: post "/api/notes/addnote" . login Required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a  Vallid title").isLength({ min: 3 }),
    body("description", "descripion should be atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors, return Bad Request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("interenal server error");
      }
  }
);
// ROUTE 3 : Update a existing note Note  Using: put "/api/notes/updatenote" . login Required
router.put(
  "/updatenote/:id",
  fetchuser ,async (req, res) => {
    const {title , description , tag} = req.body;

    try {
        // create a new object note
    const newNote = {};
    if(title){newNote.title = title}; 
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};
    console.log(newNote) 
    
    
    // find the note too be updated and update it
    let note = await Notes.findById(req.params.id);
    console.log(note) 
    if(!note){return res.status(404).send("Not Found")}


    // Allow Updation only if user owns this note
    if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")}

    note = await Notes.findByIdAndUpdate(req.params.id , {$set : newNote} , {new:true})
    // new:true <-- naya content aayega voh create ho jayega
    res.json({note})
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("interenal server error");
    }
  
  })
// ROUTE 4 : Delete an existing note Note  Using: Delete "/api/notes/updatenote" . login Required
router.delete(
  "/deletenote/:id",
  fetchuser ,async (req, res) => {
    const {title , description , tag} = req.body;
    
    try {
      
    // find the note too be Delete and delete it
    let note = await Notes.findById(req.params.id);
    // console.log(note) 
    if(!note){return res.status(404).send("Not Found")}

    // Allow Deletion only if user owns this note
    if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")}

    note = await Notes.findByIdAndDelete(req.params.id)
    // new:true <-- naya content aayega voh create ho jayega
    res.json({"suceess" : "Note has ben deleted" , note : note})
      
    }
    catch (error) {
      console.error(error.message);
      res.status(500).send("interenal server error");
    }
    
  })
module.exports = router;
