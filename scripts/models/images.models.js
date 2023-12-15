////Image models to obtain the images stored on MongoDB
//Require DB
const { ObjectId } = require("mongodb");
const db = require("../data/database");

//Class Image + functions used
class Image {
  constructor(imageData) {
    this.imageName = imageData.imageName;
    this.image = imageData.image;
    this.imagePath = `/perseus/images/${imageData.image}`;
    this.imageUrl = `/perseus/images/${imageData.image}`;
    if (imageData._id) {
      this.id = imageData._id.toString();
    }
  }

  static async findAll() {
    const imagesStore = await db
      .getDb()
      .collection("storedImages")
      .find()
      .toArray();
    console.log(imagesStore);
    return imagesStore.map(function (imageDocument) {
      return new Image(imageDocument);
    });
  }

  static async findOne(id) {
    const imagesStore = await db
      .getDb()
      .collection("storedImages")
      .findOne({ _id: ObjectId(`${id}`) });
    return new Image(imagesStore);
  }

  async save() {
    const imageData = {
      imageName: this.imageName,
      image: this.image,
    };
    await db.getDb().collection("storedImages").insertOne(imageData);
  } //Talk to the DB to insert and save the image.
}

//Export
module.exports = Image;
