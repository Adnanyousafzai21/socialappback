require("./config");
const express = require("express");
const allblogs = require("./allpost/allpost");
const registration = require("./user/user")
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res)=>{

  res.send({message:"hello succesfully don"})
})
app.post("/register", async (req, res) => {
  try {
    const regest = new registration(req.body)
    const regester = await regest.save()
    res.send(regester)

  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).send("email is already in use")
    } else {

      res.status(500).send("An error occurred while saving the product.");
    }

  }
})
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

app.get("/getupdateblog/:id", async(req, res)=>{
 try{
  const { id } = req.params;
  const getdata = await allblogs.findOne({ _id: id });
  if (getdata) {
    res.send(getdata);
  } else {
    res.status(404).send("Data not found");
  }
 }catch(error){
  res.status(500).send("an error while getting data". error)
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
