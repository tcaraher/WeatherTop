export const aboutController = {
  index(request, response) {
    const viewData = {
      title: "Weather Top",
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
