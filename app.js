const express = require("express");
const path = require("path");
const sqlite = require("sqlite");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false })); 

const db_name = path.join(__dirname, "data", "app.db");
const db = new sqlite.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'app.db'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Students (
  Student_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name VARCHAR(100) NOT NULL,
  Surname VARCHAR(100) NOT NULL,
  Comments TEXT
);`;

db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Students' table");
});
const sql_insert = `INSERT INTO Students (Student_ID, Name, Surname, Comments) VALUES
  (1, ' Tom', 'Evan', 'First in the class'),
  (2, 'Ann', 'Black', 'Second in the class '),
  (3, 'Bell', 'Gray', 'Last in the class');`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 3 students in database");
  });



app.listen(4000, () => { {
  console.log("Server started (http://localhost:4000/) !");
}});

app.get("/", (req, res) => { {
  res.render("index");
}});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/data", (req, res) => {
  const test = {
    title: "Test",
    items: ["one", "two", "three"]
  };
  res.render("data", { model: test });
});

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM Students ORDER BY Name"
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("students", { model: rows });
  });
});

app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

app.post("/create", (req, res) => {
  const sql = "INSERT INTO Students (Name, Surname, Comments) VALUES (?, ?, ?)";
  const student = [req.body.Name, req.body.Surname, req.body.Comments];
  db.run(sql, student, err => {
    if(err){
      return console.error(err.message)
    }
    res.redirect("/students");
  });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Students WHERE Student_ID = ?";
  db.get(sql, id, (err, row) => {
    if(err){
      return console.error(err.message)
    }
    res.render("edit", { model: row });
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const student = [req.body.Name, req.body.Surname, req.body.Comments, id];
  const sql = "UPDATE Students SET Name = ?, Surname = ?, Comments = ? WHERE (Student_ID = ?)";
  db.run(sql, student, err => {
    if(err){
      return console.error(err.message)
    }
    res.redirect("/students");
  });
});



app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Students WHERE Student_ID = ?";
  db.get(sql, id, (err, row) => {
    if(err){
      return console.error(err.message)
    }
    res.render("delete", { model: row });
  });
});

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Students WHERE Student_ID = ?";
  db.run(sql, id, err => {
    if(err){
      return console.error(err.message)
    }
    res.redirect("/students");
  });
});





