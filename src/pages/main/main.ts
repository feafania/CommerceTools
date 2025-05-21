import "./main.css";

const MainView = {
  async render() {
    const container = document.createElement("section");
    container.id = "main";
    container.className = "view main-view";

    return container;
  },
};

export default MainView;
