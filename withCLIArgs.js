const express = require('express');
const sqlite = require('sqlite3');
const minimist = require('minimist')
const path = require('path');
const util = require('util');
const fs = require('fs');
const http = require('http')

const DB_PATH = path.join(__dirname,'my.db')
const DB_SQL_PATH = path.join(__dirname,'mydb.sql')


const args = minimist(process.argv.slice(2),{
  string: ['customerName','itemName','operation'],
  number: ['price']
})

let SQL3;
 



async function main(){
  const {customerName , itemName , price , operation} = args

  if(!customerName || !itemName || !price){
    return error(`missing required args`);
  }
  
  console.log({customerName , itemName , price} )
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

  if(operation==='create'){
    const customerId = await insertOrLookupCustomer(customerName);
    console.log({customerId})
  
    const purchaseId = await purchaseItem(itemName,price,customerId)
    console.log({purchaseId })
  }

  if(operation==='fetch'){
    const allItems = await getAllPurchases()
    console.table(allItems)
  }

  if(operation==='remove'){
    const result = await removeCustomer(customerName)

  }
  
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


async function purchaseItem(itemName, price,customerId){
  const INSERT_ITEM_QUERY = `INSERT INTO Purchase (itemName,price,customerId) VALUES(?,?,?)`;
  const result = await SQL3.run(INSERT_ITEM_QUERY,itemName,price,customerId)
  return result && result.lastID
}

async function getAllPurchases(){
  const GET_ALL_ITEMS = `SELECT * FROM Purchase`
  const result = await SQL3.all(GET_ALL_ITEMS)
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

main().catch(error)

function error(err){
  console.error(err)
}

// const app = express();
// const port = 8000;

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });


// app.get('/stashtest', (req, res) => {
//   res.send('Hello World!')
// });
// app.get('/testingfor stash', (req, res) => {
//   res.send('Hello testing for stash!')
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`)
// });
