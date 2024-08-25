import { userStore } from "../models/user-store.js";

export const accountsController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("weatherTop", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("weatherTop", user.email);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  async userProfile(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request)
    if (loggedInUser) {
      const viewData = {
        title: "User Profile",
        loggedInUser: loggedInUser,
      };
      response.render('user-profile', viewData);
    }
    else {
      response.redirect('/login');
    }
  },

async updateUserProfile(request, response){
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const updatedProfile = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password
    }
    await userStore.updateUser(loggedInUser, updatedProfile)
    response.redirect("/user-profile")
},


  async getLoggedInUser(request) {
    const userEmail = request.cookies.weatherTop;
    return await userStore.getUserByEmail(userEmail);
  },
};
