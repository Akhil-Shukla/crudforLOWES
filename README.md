# crudforLOWES
CRUD app.

FOR TEST CASES
Install all node modules run "npm install".
Run the test cases to mock the apis by running "npm test".


TO SEE ON BROWSER
Run file index.js using command "node index.js"

Entry point for the App is Index.js where basic sql connection in done made and operations are written , while in router.js all the apis to be mocked are present and all the test cases are written in side routes.test.js.


API DOCUMENTATION.

localhost:4005/allUsers : will display all users on browser.
localhost:4005/createUser : to create a new user data must be in json format {customerName: "customer name"}

localhos:4005/deleteUser : to delete the user data must be in json format {customerName: "customer name}

localhost:4005/updateUser : to update existing user data must be in format {customerName: "old name" , newName: "new name"}

