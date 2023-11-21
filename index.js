require("./config");
const express = require("express");
const allblogs = require("./allpost/allpost");
const registration = require("./user/user")
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {

  res.send({ message: "hello succesfully don" })
})
app.post("/register", async (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const emailUnique = await registration.findOne({ email: email });

    if (emailUnique) {
      res.status(400).json({ status: "failed", message: "Email already in use" });
    } else {
      if (email && firstname && lastname && password) {
        const doc = new registration({
          firstname, lastname, email, password
        });
        const registeredUser = await doc.save();
        // res.status(201).json(registeredUser);
        res.send({"status":"Success", "massage":"registered successfully "})
      } else {
        res.status(400).json({ status: "failed", message: "All fields are required" });
      }
    }

  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).json({ status: "failed", message: "Email is already in use" });
    } else {
      console.error("Registration error:", error);
      res.status(500).json({ status: "failed", message: "An error occurred while saving the product." });
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
  if(email && password){
    const user = await registration.find({ email, password });

    if (user) {
      res.semd({ message: 'Login successful' });
    } else {
      res.status(401).send({ message: 'user not exist' });
    }
  }
  else{
    res.status(500).json({ status: "failed", message: "all field are required!" });
   
  }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post("/allblogs", async (req, res) => {
  try {
    const newblog = new allblogs(req.body);
    const saveblog = await newblog.save();

    res.send(saveblog);
  }
  catch (erro) {
    res.status(500).send("An error occurred while saving the product.");
  }
});
app.get("/allblogs", async (req, res) => {
  try {
    const getdata = await allblogs.find();
    res.send(getdata);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the data.", error);
  }
});

app.get("/blogs/:firstname", async (req, res) => {
  try {
    const { firstname } = req.params;
    const getdata = await allblogs.find({ firstname: firstname });
    res.send(getdata);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the data.", error);
  }
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await allblogs.deleteOne({ _id: id });
    if (deletedBlog.deletedCount === 1) {
      res.status(200).send("Blog deleted successfully");
    } else {
      res.status(404).send("Blog not found");
    }
  } catch (error) {
    res.status(500).send("an error accur while deleting the blog", error)
  }
})

app.get("/getupdateblog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getdata = await allblogs.findOne({ _id: id });
    if (getdata) {
      res.send(getdata);
    } else {
      res.status(404).send("Data not found");
    }
  } catch (error) {
    res.status(500).send("an error while getting data".error)
  }

})

app.put("/updateblog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, discription } = req.body;

    const updatedBlog = await allblogs.findByIdAndUpdate(
      id,
      { title, discription },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).send("Blog not found");
    }

    res.send(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).send("An error occurred while updating the blog.");
  }
});












const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
