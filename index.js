const http = require("http");
const { writeFile, readFile } = require("fs").promises;
const PORT = process.env.PORT || 5000;
const dataHandler = require("./Utils/dataHandler");
const routes = require("./Routes/note");

const server = http.createServer(routes);

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
