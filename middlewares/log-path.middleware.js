const logPath = (rea, res, next) => {
    console.log(req.body);
    next();
}

module.exports = logPath;