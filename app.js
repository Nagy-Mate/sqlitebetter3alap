import express from "express";
import * as db from './Util/database.js';

const PORT  = 8080;
const app = express();
app.use(express.json());

app.get('/users', (req, res)=>{
    try{
        const users = db.getUsers();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({message: `${err}`});
    }

});

app.get('/users/:id', (req, res) =>{
    try{
        const user = db.getUser(req.params.id);
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

app.post('/users', (req, res)=>{
    try{
        const {name, age} = req.body;
        if(!name || !age){

            return res.status(404).json({message: 'Invalid credentials'})
        }
        const savedUser = db.saveUser(name,age);
        if(savedUser.changes != 1){
             return res.status(501).json({message: "User save failed!"})
        }
        res.status(201).json({id: savedUser.lastInsertRowid, name, age});
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

app.put('/users/:id', (req, res)=>{
    try{
        const {name, age} = req.body;
        if(!name || !age){

            return res.status(404).json({message: 'Invalid credentials'})
        }
        const id = req.params.id;
        const updatedUser = db.updateUser(id,name,age);
        if(updatedUser.changes != 1){
             return res.status(501).json({message: "User update failed!"})
        }
        res.status(200).json({id, name, age});
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

app.delete('/users/:id', (req, res)=>{
    try{
        const deletedUser = db.deleteUser(req.params.id);
        if(deletedUser.changes != 1){
             return res.status(501).json({message: "User delete failed!"})
        }
        res.status(200).json({message: "Deleted successful"})
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

app.listen(PORT, ()=>{
    console.log(`server runs on port: ${PORT}`)
});