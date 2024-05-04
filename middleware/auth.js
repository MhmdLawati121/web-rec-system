function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(403).redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.session.role !== "admin") {
    return res.status(403).send("Forbidden");
  }
  next();
}

function requireHr(req, res, next) {
  if (req.session.role !== "hr") {
    return res.status(403).send("Forbidden");
  }
  next();
}

function requireAdminOrHr(req, res, next) {
  if (req.session.role !== "admin" && req.session.role !== "hr") {
    return res.status(403).send("Forbidden");
  }
  next();
}

function requireHead(req, res, next) {
  if (req.session.head !== true) {
    return res.status(403).send("Forbidden");
  }
  next();
}

module.exports = { requireAuth, requireAdmin, requireHr, requireHead, requireAdminOrHr };
