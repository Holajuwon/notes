const { parse } = require("url");
const {
  createNotes,
  getNote,
  deleteNote,
  updateNote,
  getSummary,
} = require("../Controllers/note");

module.exports = (req, res) => {
  const { url, method } = req;
  const { pathname } = parse(url, true);

  if (pathname === "/note/" && method === "GET") {
    getNote(req, res);
  } else if (pathname === "/note/summary" && method === "GET") {
    getSummary(req, res);
  } else if (pathname === "/note" && method === "POST") {
    createNotes(req, res);
  } else if (pathname === "/note" && method === "DELETE") {
    deleteNote(req, res);
  } else if (pathname === "/note" && method === "PUT") {
    updateNote(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        remark: "error",
        message: "route Not found",
      })
    );
  }
};
