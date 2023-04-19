exports.handleLogout = function (req, res) {
  try {
    //RUN LOGOUT METHOD IN CASE THE USER IS AUTHENTICATED WITH GOOGLE ACCOUNT
    req.logout((error) => {
      if (error) {
        console.log(`Logout error ${error}`);
      }
    });
    //CLEAR THE TOKENS IN THE COOKIE
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).send("Tokens in Cookie are deleted");
  } catch (e) {
    console.log(`Logout Error ${e}`);
  }
};
