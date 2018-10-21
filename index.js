const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require("mongoose");

const Todo = require("./models/todo");

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(
    "mongodb://todo-assignement:todo123@cluster0-shard-00-00-lnpuz.mongodb.net:27017,cluster0-shard-00-01-lnpuz.mongodb.net:27017,cluster0-shard-00-02-lnpuz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true }
);
app.get('/', (req, res) => {
    res.json({
        todo: 'full stack todo board! 🎉'
    });
});

app.get('/todos', (req, res) => {
    Todo.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


app.patch("/todos/:todoId", (req, res, next) => {
    const id = req.params.todoId;
    //const updateOps = {};
    // for (const ops of req.body) {
    //   updateOps[ops.propName] = ops.value;
    // }
    console.log(req.body)
    Todo.update({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
app.post('/todos', (req, res) => {
    const todo = new Todo({
        _id: new mongoose.Types.ObjectId(),
        id: req.body.id,
        title: req.body.title,
        completed: req.body.completed
    });

    todo
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /todos",
                createdTodo: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

app.get("/todos/:todoId", (req, res, next) => {
    const id = req.params.todoId;
    Todo.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


app.delete("/todos/:todoId", (req, res, next) => {
    const id = req.params.todoId;
    Todo.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
const port = 8081;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});