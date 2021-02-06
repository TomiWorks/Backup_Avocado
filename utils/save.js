const fs = require("fs");
const backups = JSON.parse(fs.readFileSync("./backups/backups.json", "utf8"));

module.exports = async function() {
  fs.writeFile("./backups/backups.json", JSON.stringify(backups), err => {
    if (err) console.error(err);
  });
}