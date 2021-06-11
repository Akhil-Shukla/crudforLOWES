const { Router, response } = require("express");
const util = require('util');
const sqlite = require('sqlite3');
const path = require('path');


const router = new Router();

const DB_PATH = path.join(__dirname,'my.db')
const DB_SQL_PATH = path.join(__dirname,'mydb.sql')
const myDB = new sqlite.Database(DB_PATH)


let SQL3 = {
    get: util.promisify(myDB.get.bind(myDB)),
    exec: util.promisify(myDB.exec.bind(myDB)),
    all: util.promisify(myDB.all.bind(myDB)),
    run: function(...args){
      return new Promise(function(resolve,reject){
        myDB.run(...args, function(err){
  
          if(err){
            reject(err);
          }
          resolve(this);
           
        });
    
      });
    }  
  };


async function insertOrLookupCustomer(customerName,options={isCreate:true}){
    const GET_CUSTOMER_QUERY = `SELECT id FROM  Customer WHERE fullname = ?`;
    const INSERT_CUSTOMER_QUERY = `INSERT INTO Customer(fullName) VALUES(?)`;
    
    let result = await SQL3.get(GET_CUSTOMER_QUERY,customerName);
    if(result && result.id){
      return result.id;
    }
    if(options.isCreate){
      result = await SQL3.run(INSERT_CUSTOMER_QUERY,customerName);
      console.log('Created new customer',result)
      return result.lastID
    }
    
  }
  
async function getAllCustomer(){
    const GET_ALL_ITEMS = `SELECT * FROM Customer`
    const result = await SQL3.all(GET_ALL_ITEMS)
    return result
}

async function updateCustomer(customerName,newName){
    
    const UPDATE_CUSTOMER_QUERY = `UPDATE Customer SET fullname = ? WHERE id = ?`

    let customerId = await insertOrLookupCustomer(customerName,options={isCreate:false})
    // console.log(customerId)

    let result = await SQL3.run(UPDATE_CUSTOMER_QUERY,newName,customerId)    
    
    return result
}

async function removeCustomer(customerName){
    const customerId = await insertOrLookupCustomer(customerName,{
      isCreate:false,
    });
  
  if(customerId){
    const REMOVE_PURCHASE_QUERY = `DELETE from Purchase WHERE customerId = ?`
    let result = await SQL3.run(REMOVE_PURCHASE_QUERY,customerId);
    console.log(result)
    const REMOVE_CUSTOMER_QUERY = `DELETE from Customer WHERE id = ?`
    result = await SQL3.run(REMOVE_CUSTOMER_QUERY,customerId);
    return result.changes;
  }
  
  }


router.get("/allUsers", async(req, res) => {
  let result = await getAllCustomer()
  
  res.json(result)
  res.end()
  
});

router.post("/createUser", async(request, response) => {
    const {customerName} = request.body;

    if(customerName===null){
      response.end("could not create customer with empty name")
    }else{
      let result = await insertOrLookupCustomer(customerName,options={isCreate:true})
      response.json({status:"success",id:result})
      response.end()
    }
    
  });


  router.post("/deleteUser", async(req, res) => {
    
    const {customerName} = req.body;
    let result = await removeCustomer(customerName)
    
    res.json({
      status: "success",
      id:result
    });
  });

  router.post("/updateUser", async(req, res) => {
    
    const {customerName,newName} = req.body;
    
    let result = await updateCustomer(customerName,newName)
    
    res.json({
      status: "success",
    });
  });




module.exports = router;
