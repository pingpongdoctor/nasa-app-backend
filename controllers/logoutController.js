exports.handleLogout = function (_req, res) {
  try {
    //CLEAR THE COOKIE
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).send("The refresh token is deleted");
  } catch (e) {
    res.status(500).send("Server Error");
  }
};
