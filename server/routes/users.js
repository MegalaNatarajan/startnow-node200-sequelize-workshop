const express = require('express');
const router = express.Router();
const db = require('../db/models');

db.Author.create({
    firstName: 'megala',
    lastName: 'megala',
    email: 'megala'
})
.then(author => {
   console.log('Inserted author into MySQL');
})
.catch(console.error);
  
    router.get('/', (req, res) => {
    
    db.Author
        .findAll()
        .then(users => {
            res.status(200).json(users);
        });
});
router.get('/:id',function(req,res){
   
  var id1 = req.params.id;
  console.log("Checking for ID ", id1);
  
  db.Author.findById(id1)
      
  // MySQL typically uses integral primary keys
  .then(author => {
      if(author) return res.status(200).send(author);
      else return res.status(404).send();

  })
  
});
router.post('/', function(req,res){
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    var email = req.params.email;
    db.Author.create({
        firstName: firstName,
        lastName: lastName,
        email: email
    })
    .then(author => {
       console.log('Inserted author into MySQL');
       res.status(201).send(author);
    })
    .catch(console.error); 
});
router.put('/:id', function(req,res){
    var id1 = req.params.id;
    
    db.Author
    .update({ firstName: req.param('firstName'),
        lastName: req.param('lastName'),
        email: req.param('email') }, { 
        where: { id: { $eq: id1 } }
    })
    .then((author) => {console.log('Updated author')
    res.status(204).send(author);})
    
});
router.delete('/:id',function(req,res){
    var id1 = req.params.id;
    
    db.Author.findById(id1)
    .then(author => { 
        return author.destroy();
    })
    .then(()=> {console.log('Removed the user')
        res.status(200).send();
  })
  .catch(console.error);
  });
module.exports = router;