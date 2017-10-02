const express = require('express');
const router = express.Router();
const db = require('../db/models');

 db.Blog.create({
    title: 'megala',
    article: 'megala',
    published: '2/2/2007',
    featured: true
 })
 .then(blog => {
    console.log('Inserted blog into MySQL');
})
.catch(console.error);

router.get('/', (req, res) => {
    
    db.Blog
        .findAll()
        .then(blogs => {
            res.status(200).json(blogs);
        });
});
router.get('/featured', (req, res) => {
    var feature = req.params.featured;
    db.Blog
        .findAll({
            where: {
                featured:feature
            }
        })
        .then(blogs => {
            res.status(200).json(blogs);
        });
});
router.get('/:id',function(req,res){
    var id1 = req.params.id;
    console.log("Checking for ID ", id1);
    db.Blog.findById(id1)
        
    // MySQL typically uses integral primary keys
    .then(blogs => {
        if(blogs) return res.status(200).send(blogs);
        else return res.status(404).send();
    })
    .catch(console.error);
});
router.post('/',function(req,res,next) {
    var userId = req.params.userId;
     db.Blog.create ({
         //authorId:userId, 
         title: req.param('title'),
         article: req.param('article'),
         published: req.param('published'),
         featured: req.param('featured'),
         _id:userId
       })
       .then(blog => {
        console.log('Inserted blog into MySQL');
        res.status(201).send(blog);
    })
    .catch(console.error);
});     
router.put('/:id', function(req,res) {
    var id1 = req.params.id;
  
    db.Blog.update({ title: req.param('title'),
    article: req.param('article'),
    published: req.param('published'),
    featured: req.param('featured') },{where: { id: { $eq: id1 }} })
    .then(blogs => {console.log('Saved the user')
    res.status(204).send(blogs);
  });
  })

router.delete('/:id',function(req,res){
    var id1 = req.param('id');
    var id2 = id1.replace(':',"");
    db.Blog.findById(id2)
    .then(blogs => { 
        return blogs.destroy();
    })
    .then(()=> {console.log('Removed the user')
        res.status(200).send();
  })
  .catch(console.error);
  });
module.exports = router;