exports.handleLogout = function (req, res) {
  try {
    //RUN LOGOUT METHOD IN CASE THE USER IS AUTHENTICATED WITH GOOGLE ACCOUNT
    req.logout((e) => {
      if (e) {
        console.log(`Logout error ${e}`);
      }
    });
    //CLEAR THE TOKENS IN THE COOKIE
    res
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .status(200)
      .send("Tokens in Cookie are deleted");
  } catch (e) {
    console.log(`Logout Error ${e}`);
  }
};
