const express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
//mongoose model method allows api interaction while the schema defines the structure of the collections/tables
mongoose.connect('mongodb://localhost:32017/blogDb', { useNewUrlParser: true })
    //lets create a schema
var PostSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    body: { type: String },
    tags: { type: String, enum: ['POLITICS', 'TECHNOLOGY', 'ECONOMY', 'EDUCATION', 'HEALTH'] }, //enum indicates restricted options available for a field/column
    posted: { type: Date, default: Date.now() }
}); //can add the {collection:tbname} as the second param, otherwise leave the mongoose  to create one from the model name
//define and init our model
var postModel = mongoose.model("PostModel", PostSchema);
var cwd = process.cwd;

router.get("/", (req, res, next) => {
    res.sendFile(cwd() + "/public/index.html")
});

//create the api links
router.post('/api/blog/create/', createPosts);

function createPosts(req, res, next) {
    var mypost = req.body;
    //make model callback, we could use a promise as 
    /*postModel.create(mypost).then(result=>{
        //what to do on success db operation,otherwise raise an error
        res.json({status:success})
    },error=>{
        //error
        res.sendStatus(400)
    });*/
    postModel.insertMany(mypost, function(err, result) {
        if (err) {
            throw err;
        } else {
            //console.log(result)
            res.status(200).json({ status: 'success', mypost })
        }
    });
    //res.status(200).json({ status: 'success', mypost })
};
router.get('/api/posts/', getAllPosts);

function getAllPosts(req, res, next) {
    postModel.find().then(result => {

        res.json(result);
    }, error => {
        throw error;
    });

}
//edit and delete post 
router.put('/api/posts/edit/:id', updatePost);
router.delete('/api/posts/delete/:id', removePost);
router.get('/api/post/:id', getPostById);

function getPostById(req, res, next) {
    var postId = req.params.id;
    postModel.findById({ _id: postId }).then(result => {
        res.status(200).json(result)
    }, error => {
        console.log(error)
    })
}

function updatePost(req, res, next) {
    var editId = req.params.id;
    newItem = req.body;
    postModel.update({ _id: editId }, { $set: newItem }).then(result => {
        res.status(200).json({ status: 'updated', result })
    }, error => {
        console.log("ERROR Updating");
        console.log(error);
        res.status(400).json(error)
    })
}

function removePost(req, res, next) {
    delid = req.params.id;
    postModel.remove({ _id: delid }).then(result => {
        res.json({ status: 'success' })
    }, error => {
        res.status(400).json({ status: 'failed' })
    })

}
module.exports = router;