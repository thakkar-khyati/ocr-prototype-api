const utill = {
  status: {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    pageExpired: 419,
    serverError: 500,
  },
  message: {
    success: "OK, Action completed successfully",
    created: "Success following a POST command",
    badRequest: "Request had bad syntax or was impossible to fulfill",
    unauthorized:
      "User failed to provide a valid user name/password required for access to a file/directory",
    notFound: "Requested file was not found",
    pageExpired: "Token Expired",
    serverError: "can not connect to server",
  },
};

module.exports = utill;
