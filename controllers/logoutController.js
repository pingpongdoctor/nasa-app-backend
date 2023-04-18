exports.handleLogout = async function (_req, res) {
  try {
    //CLEAR THE COOKIE
    await res.clearCookie("refreshToken");
    res.status(200).send("The refresh token is deleted");
  } catch (e) {
    throw new Error(e);
  }
};
