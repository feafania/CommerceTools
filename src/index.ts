import initApp from "./init-app";

import backgroundPicture from "@/assets/img/body_bg_new.jpg";

const root = document.createElement("div");
root.id = "root";
root.style.backgroundImage = `url(${backgroundPicture})`;
document.body.append(root);

initApp(root);
