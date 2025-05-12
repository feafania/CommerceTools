import "./main.css";

const MainView = {
  renderChat() {
    const container = document.createElement("section");
    container.id = "main";
    container.className = "view main-view";

    return container;
  },
};

export default MainView;
