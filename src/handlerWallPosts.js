const request = require("request");
const api_VK = require("./config/api.VK");

module.exports.getPost = function getPost(idPost, callback) {
  request(
    api_VK.basePath + api_VK.methods.wall.getById(idPost, process.env.VK_API_TOKEN),
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const tmpObject = JSON.parse(body).response[0];
        if (tmpObject && "attachments" in tmpObject && "text" in tmpObject)
          callback(null, tmpObject);
      } else return callback(error);
    }
  );
};

module.exports.getIdPost = function getIdPost(str) {
  let id = str.substr(str.indexOf("wall")).substr(4);
  if (id.indexOf("%") > -1) return id.substr(0, id.indexOf("%"));
  else if (id.indexOf("?") > -1) return id.substr(0, id.indexOf("?"));
  else return id;
};
