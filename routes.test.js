const router = require("./router.js");
const request = require('supertest');
const express = require("express");
const bodyParser = require("body-parser");


const app = express(); //an instance of an express // a fake express app
app.use(bodyParser.json()); //this made it work
app.use("/states", router); 

describe('Get endpoint', () => {
    it("GET /allUsers - success", async () => {
        const { body } = await request(app).get("/states/allUsers"); //use the request function that we can use the app// save the response to body variable
        
        expect(body).toEqual([
            {
                "id": 2,
                "fullName": "nathan"
              },
              {
                "id": 3,
                "fullName": "akhil"
              },
              {
                "id": 4,
                "fullName": null
              },
              {
                "id": 7,
                "fullName": "akhil.shukla"
              },
              {
                "id": 8,
                "fullName": "jhosn"
              }
        ]);
        firstState = body[0];
        // console.log(firstState);
    });
    it("POST /createUser - success", async () => {
        let stateObj = {
          customerName:"test customer"
        };
        const { body } = await request(app).post("/states/createUser").send(stateObj);
        
        expect(body).toEqual({
          status: "success",
          id:9
        });  
    });
    it("DELETE /user - success", async () => {
        let stateObj = {
          customerName:"test customer"
        };
        const { body } = await request(app).post("/states/deleteUser").send(stateObj);
        
        expect(body).toEqual({
          status: "success",
          id:1
        });  
    });
    it("UPDATE /user - success", async () => {
        let stateObj = {
          customerName:"new name",
          newName:"nathan"
        };
        const { body } = await request(app).post("/states/updateUser").send(stateObj);
        
        expect(body).toEqual({
          status: "success"
        });  
    });




  })
  








// describe('Post Endpoints', () => {
//   it('should create a new post', async () => {
//     let obj = {customerName:"testing"}
//     const res = await request(serverRoutes)
//       .post('/createUser')
//       .send(JSON.stringify(obj))
//     expect(res.statusCode).toEqual(201)
//     expect(res.body).toHaveProperty('Created')
//   })
// })

// describe('Sample Test', () => {
//     it('should test that true === true', () => {
//       expect(true).toBe(true)
//     })
//   })