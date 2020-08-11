const {
  readFile,
  readdir,
  writeFile,
  mkdir,
  unlink,
  rmdir,
  appendFile,
  stat,
} = require("fs").promises;
const { dataHandler, filePATH } = require("../Utils/dataHandler");
const { errorMessage } = require("../Utils/responseHandler");
const { join } = require("path");

/**
 * Function for creating notes
 * @param {*} req
 * @param {*} res
 */
exports.createNotes = async (req, res) => {
  dataHandler(req, async (data) => {
    const { title, content, directory } = data;
    try {
      const folder = `./Database/${directory}`;
      if (!directory || !content || !title) {
        res.statusCode = 400;
        res.setHeader("content-type", "application/json");
        return res.end(JSON.stringify(errorMessage()));
      }
      await mkdir(folder, {
        recursive: true,
        mode: 0o777,
      });
      await writeFile(`${folder}/${title}.txt`, content, {
        flag: "a",
        encoding: "utf-8",
      });
      res.statusCode = 201;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          remark: "Success",
          message: "Note created successfully",
        })
      );
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  });
};

/**
 * @description Function for getting a single note
 * @param {*} req
 * @param {*} res
 */
exports.getNote = async (req, res) => {
  try {
    const { filePath } = filePATH(req, res);

    if (!filePath) {
      return;
    }

    const data = await readFile(filePath, { encoding: "utf-8", flag: "r" });
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        remark: "success",
        message: "Note read successfully",
        data,
      })
    );
  } catch (error) {
    console.error(error);
    return res.end(error.message);
  }
};

/**
 * Function for updating a note.
 * @param {*} req
 * @param {*} res
 */
exports.updateNote = async (req, res) => {
  dataHandler(req, async (data) => {
    const { content } = data;

    try {
      const { filePath } = filePATH(req, res);
      if (filePath) {
        await appendFile(filePath, content, { encoding: "utf-8", flag: "a" });
        res.statusCode = 200;
        res.setHeader("content-type", "application/json");
        res.end(
          JSON.stringify({
            remark: "success",
            message: "Note updated successfully",
          })
        );
      }
    } catch (error) {}
  });
};

/**
 * Function for deleting note.
 * @param {*} req
 * @param {*} res
 */
exports.deleteNote = async (req, res) => {
  try {
    const { filePath, folder } = filePATH(req, res);
    if (filePath) {
      await unlink(filePath);
      const files = await readdir(folder);
      if (files.length === 0) {
        await rmdir(folder);
      }
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          remark: "success",
          message: "Note deleted successfully",
        })
      );
    }
  } catch (error) {
    console.error(error);
    res.end(error.message);
  }
};

/**
 * Function for getting all the summary of notes in a directory.
 * @param {*} req
 * @param {*} res
 */
exports.getSummary = async (req, res) => {
  const { folder, getFolder } = filePATH(req, res);
  try {
    if (folder) {
      const notes = await readdir(folder);
      let summary = [];
      for (const item of notes) {
        const info = await stat(`${folder}/${item}`);
        summary.push([item, info]);
      }
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          remark: "success",
          summary,
        })
      );
    }
  } catch (error) {
    console.error(error);
    res.end(error.message);
  }
};
