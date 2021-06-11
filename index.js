const express = require('express');
const sqlite = require('sqlite3');
// const minimist = require('minimist')
const path = require('path');
const util = require('util');
const fs = require('fs');
const http = require('http');
const qs = require('querystring')

const DB_PATH = path.join(__dirname,'my.db')
const DB_SQL_PATH = path.join(__dirname,'mydb.sql')


var bodyParser = require('body-parser');  

var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
let jsonparser = bodyParser.json()
const router = express.Router();

// const args = minimist(process.argv.slice(2),{
//   string: ['customerName','itemName','operation'],
//   number: ['price']
// })
const PORT = process.env.PORT || 4005;
let SQL3;
// const httpServer = http.createServer(requestHandler)
const app = express();



async function main(){

  const myDB = new sqlite.Database(DB_PATH)
  SQL3 = {
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

  const initSql = fs.readFileSync(DB_SQL_PATH,'utf-8')
  await SQL3.exec(initSql)
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use("/", router);

  router.get('/allUsers',async(req, res) => {
    res.set('Content-Type','application/json')
    const result = await getAllPurchases();
    res.send(JSON.stringify(result))
    res.end()
  });

  router.get('/html',async(req, res) => {
    res.set('Content-Type','text/html')
    res.sendFile(__dirname + '/index.html')
  });

  router.post('/createUser',async (request,response) => {
    const {customerName} = request.body;

    if(customerName===null){
      response.end("could not create customer with empty name")
    }else{
      let result = await insertOrLookupCustomer(customerName,options={isCreate:true})
      response.sendStatus(201)
      response.end(JSON.stringify(result))
    }
    
  });
  router.post('/deleteUser',async (request,response) => {
    const {customerName} = request.body;
      let result = await removeCustomer(customerName)
      response.sendStatus(201)
      response.end(JSON.stringify(result))
  });

  router.post('/updateUser',async (request,response) => {
    const {customerName,newName} = request.body;
      let result = await updateCustomer(customerName,newName)
      response.sendStatus(201)
      response.end(JSON.stringify(result))
  });
  
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`)
  });
  
}




async function updateCustomer(customerName,newName){
    
  const UPDATE_CUSTOMER_QUERY = `UPDATE Customer SET fullname = ? WHERE id = ?`

  let customerId = await insertOrLookupCustomer(customerName,options={isCreate:false})
  // console.log(customerId)

  let result = await SQL3.run(UPDATE_CUSTOMER_QUERY,newName,customerId)    
  
  return result
}



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

async function getAllPurchases(){
  const GET_ALL_ITEMS = `SELECT * FROM Customer`
  const result = await SQL3.all(GET_ALL_ITEMS)
  return result
}

async function purchaseItem(itemName, price,customerId){
  const INSERT_ITEM_QUERY = `INSERT INTO Purchase (itemName,price,customerId) VALUES(?,?,?)`;
  const result = await SQL3.run(INSERT_ITEM_QUERY,itemName,price,customerId)
  return result && result.lastID
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

main().catch(error)

function error(err){
  console.error(err)
}

module.exports = router;






