const { Logger } = require("up");
const log = new Logger();

log.error("user login attempt failed", { user: "nwaiwuchrys" });
log.info("user login", { user: "nwaiwuchrys" });
log.info("user logout", { user: "nwaiwuchrys" });

module.exports = log;
