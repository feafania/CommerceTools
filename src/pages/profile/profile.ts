import { SETTINGS } from "@/config/settings";
import createInput from "@/components/input/input";
// import createButton from "@/components/button/button";
// import { AddressType, FormType, PageType } from "@/types/enum";
// import AddressElement from "@/components/address/address";

const UserProfile = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "user-profile";
    container.className = "view user-profile-view";

    const h2 = document.createElement("h2");
    h2.className = "profile-title";
    h2.textContent = SETTINGS.label.userProfile.header || "User Profile";

    const loginDataContainer = document.createElement("div");
    loginDataContainer.className = "form-group";
    loginDataContainer.append(
      createInput({
        type: "text",
        label: SETTINGS.label.userProfile.email,
        name: "email",
        placeholder: `${SETTINGS.label.userProfile.email}...`,
        id: "email",
        class: "email-input",
        // value: user.email,
      }),
    );

    const userDataContainer = document.createElement("div");
    userDataContainer.className = "form-group";
    userDataContainer.append(
      createInput({
        type: "text",
        label: SETTINGS.label.userProfile.firstName,
        name: "firstname",
        placeholder: `${SETTINGS.label.userProfile.firstName}...`,
        id: "firstname",
        class: "firstname-input",
        // value: user.firstName,
      }),
      createInput({
        type: "text",
        label: SETTINGS.label.userProfile.lastName,
        name: "lastname",
        placeholder: `${SETTINGS.label.userProfile.lastName}...`,
        id: "lastname",
        class: "lastname-input",
        // value: user.lastName,
      }),
      createInput({
        type: "date",
        label: SETTINGS.label.userProfile.birthDay,
        name: "birthday",
        id: "birthday",
        class: "birthday-input",
        // value: user.dateOfBirth,
      }),
    );

    const form = document.createElement("form");
    form.className = "profile-form form";
    form.append(
      loginDataContainer,
      userDataContainer,
      // this.renderAddressesFromUser(user),
      // this.renderSubmit("Save Changes")
    );

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      // this.onProfileSubmit(event);
    });

    container.append(h2, form);
    return container;
  },
};

export default UserProfile;
