#! /usr/bin/env node

console.log(
    'This script populates some items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item");
  const Category = require("./models/category");
  
  const items = [];
  const categories = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function categoryCreate(index, name) {
    const category = new Category({ name: name });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }

  async function itemCreate(index, name, category, price, numberInStock, expiryDate) {
    const itemDetail = {
      name: name,
      category: category,
      price: price,
      numberInStock: numberInStock,
    };
    if (expiryDate != false) { itemDetail.expiryDate = expiryDate}
  
    const item = new Item(itemDetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Fruits"),
      categoryCreate(1, "Vegtables"),
      categoryCreate(2, "Dairy"),
      categoryCreate(3, "Bakery"),
    ]);
  }
  
  async function createItems() {
    console.log("Adding items");
    await Promise.all([
      itemCreate(0,
        "Apple",
        categories[0],
        3.5,
        30,
        "2020-10-20",
      ),
      itemCreate(1,
        "Orange",
        categories[0],
        4.0,
        30,
        "2020-10-20",
      ),
      itemCreate(2,
        "Milk",
        categories[2],
        5.0,
        10,
        "2020-10-15",
      ),
      itemCreate(3,
        "Eggs",
        categories[2],
        12.0,
        5,
        "2020-10-15",
      ),
      itemCreate(4,
        "Bread",
        categories[3],
        6.5,
        10,
        "2020-10-29",
      ),
      itemCreate(5,
        "Lettuce",
        categories[1],
        2.0,
        5,
        "2020-11-3",
      ),
    ]);
  }
  