const http = require("http");
const PORT = process.env.PORT || 5000;
const routes = require("./Routes/note");

const server = http.createServer(routes);

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
