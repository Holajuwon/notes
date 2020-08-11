const { parse } = require("querystring");
const { parse: parseURL } = require("url");
const { errorMessage } = require("../Utils/responseHandler");
const { existsSync } = require("fs");

exports.dataHandler = (req, res) => {
  let body = "";
  const content = req.headers["content-type"];
  const type = {
    urlrencoded: "application/x-www-form-urlencoded",
    json: "application/json",
  };

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  if (content === type.urlrencoded) {
    req.on("end", () => {
      const data = parse(body);
      res(data);
    });
  } else if (content === type.json) {
    req.on("end", () => {
      const data = JSON.parse(body);
      res(data);
    });
  } else {
    res(null);
  }
};

exports.filePATH = (req, res) => {
  const { directory, title } = parseURL(req.url, true).query;

  if (!directory || !title) {
    res.statusCode = 400;
    res.setHeader("content-type", "application/json");
    return res.end(JSON.stringify(errorMessage()));
  }

  const filePath = `./Database/${directory}/${title}.txt`;
  const folder = `./Database/${directory}`;

  if (!existsSync(filePath)) {
    res.statusCode = 404;
    res.setHeader("content-type", "application/json");
    return res.end(
      JSON.stringify({
        remark: "Error",
        message: `resource at ${filePath} does not exist`,
      })
    );
  }
  return { filePath, folder };
  
};
