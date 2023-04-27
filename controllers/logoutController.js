//CALLBACK FUNCTION TO LOG OUT
exports.handleLogout = function (req, res) {
  try {
    //RUN LOGOUT METHOD
    req.logout((e) => {
      if (e) {
        console.log(`Logout error ${e}`);
      }
    });

    //CLEAR THE TOKENS IN THE COOKIE
    res
      .clearCookie("refreshToken", { path: "/" })
      .clearCookie("accessToken", { path: "/" })
      .status(200)
      .send("Tokens in Cookie are deleted");
  } catch (e) {
    console.log(`Logout Error ${e}`);
  }
};
