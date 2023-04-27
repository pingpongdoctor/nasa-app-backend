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
      .clearCookie("refreshToken", {
        sameSite: "none",
        secure: true,
      })
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send("Tokens in Cookie are deleted");
  } catch (e) {
    console.log(`Logout Error ${e}`);
  }
};
