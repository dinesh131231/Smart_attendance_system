const ipRestriction = (req, res, next) => {
  let ip = req.ip;

  if (ip.includes("::ffff:")) {
    ip = ip.split("::ffff:")[1];
  }

  console.log("User IP:", ip);

  if (ip.startsWith("192.168")) {
    next();
  } else {
    res.status(403).json({ message: "Not in institute network" });
  }
};
export default ipRestriction;