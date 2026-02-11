const { v4: uuid } = require("uuid");

module.exports = (req, res, next) => {
  let guestId = req.cookies.guestId;

  if (!guestId) {
    guestId = uuid();

    res.cookie("guestId", guestId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    });
  }

  req.guestId = guestId;

  next();
};
