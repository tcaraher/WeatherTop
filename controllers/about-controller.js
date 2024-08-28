export const aboutController = {
  index(request, response) {
    const viewData = {
      title: "Weather Top",
    };
    response.render("about-view", viewData);
  },
};
