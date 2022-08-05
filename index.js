var express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const isJson = require("is-json");
const fs = require("fs");
const app = express();
const PORT = 4000;
const multer = require("multer");
const XLSX = require("xlsx");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.get("/",(req,res) => {
  res.render("home");
})

app.post("/jsontoexcel", upload.array("data"), (req, res) => {

  let userdata = req.body;
  console.log(req.files);

  let filename = userdata.filename.concat(".xlsx");
  const workbook = XLSX.utils.book_new();
  if (req.files.length > 1) {
    req.files.forEach((file) => {
      userdata.data = file.path.slice(8);
      let sheetname = userdata.data.split(".")[0];

      const jsondata = fs.readFileSync(file.path, {
        encoding: "utf8",
        flag: "r",
      });
      
      var raw = JSON.parse(jsondata);
      var files = [];
      for (each in raw) {
        files.push(raw[each]);
      }
      var obj = files.map((e) => {
        return e;
      });
    
      const workSheet = XLSX.utils.json_to_sheet(obj);

      XLSX.utils.book_append_sheet(workbook, workSheet, sheetname);

      XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

      XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

      const filePath = path.join(__dirname,'downloads/'.concat(filename));

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader("Content-Disposition", "attachment; filename=" + filename);
  
      
      XLSX.writeFile(workbook, filePath);

     
     
    });
  }
  
  res.end();
});

app.listen(PORT, () => {
  console.log("your app is listening to port 4000");
});
