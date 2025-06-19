import "./about.css";
import logoInline from "@/assets/svg/rs-school-logo.inline.svg";
import { SETTINGS } from "@/config/settings";
export const aboutData = {
  title: SETTINGS.label.about.title,
  description: SETTINGS.label.about.description,
  members: [
    {
      id: 1,
      name: SETTINGS.label.about.name1,
      photo: SETTINGS.label.about.photo1,
      bio: SETTINGS.label.about.bio1,
      role: SETTINGS.label.about.role1,
      tasks: SETTINGS.label.about.tasks1,
      github: SETTINGS.label.about.github1,
    },
    {
      id: 2,
      name: SETTINGS.label.about.name2,
      photo: SETTINGS.label.about.photo2,
      bio: SETTINGS.label.about.bio2,
      role: SETTINGS.label.about.role2,
      tasks: SETTINGS.label.about.tasks2,
      github: SETTINGS.label.about.github2,
    },
  ],
  projectDescription: SETTINGS.label.about.projectDescription,
};

function createMemberPhoto(
  member: (typeof aboutData.members)[0],
): HTMLImageElement {
  const photo = new Image();
  photo.src = member.photo;
  photo.alt = `${member.name}'s profile`;
  photo.className = "member-photo";
  return photo;
}

function createMemberInfo(member: (typeof aboutData.members)[0]): HTMLElement {
  const infoContainer = document.createElement("div");

  const name = document.createElement("h3");
  name.className = "member-name";
  name.textContent = member.name;
  infoContainer.append(name);

  const bio = document.createElement("p");
  bio.className = "member-bio";
  bio.textContent = member.bio;
  infoContainer.append(bio);

  const role = document.createElement("p");
  role.className = "member-role";
  role.textContent = `Role: ${member.role}`;
  infoContainer.append(role);

  return infoContainer;
}

function createTasksList(tasks: string[]): HTMLUListElement {
  const tasksList = document.createElement("ul");
  tasksList.className = "tasks-list";

  for (const task of tasks) {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.textContent = task;
    tasksList.append(taskItem);
  }

  return tasksList;
}

function createGitHubLink(githubUrl: string): HTMLAnchorElement {
  const github = document.createElement("a");
  github.href = githubUrl;
  github.textContent = SETTINGS.label.about.githubBtn;
  github.className = "member-github";
  github.target = "_blank";
  github.rel = "noopener noreferrer";
  return github;
}

function createMemberCard(member: (typeof aboutData.members)[0]): HTMLElement {
  const memberCard = document.createElement("div");
  memberCard.className = "member-card";

  memberCard.append(createMemberPhoto(member));
  memberCard.append(createMemberInfo(member));

  const tasksTitle = document.createElement("h4");
  tasksTitle.className = "tasks-title";
  tasksTitle.textContent = "Tasks done:";
  memberCard.append(tasksTitle);

  memberCard.append(createTasksList(member.tasks));
  memberCard.append(createGitHubLink(member.github));

  return memberCard;
}

export default async function renderAboutView(): Promise<HTMLElement> {
  const container = document.createElement("section");
  container.id = "about";
  container.className = "view about-view";

  const title = document.createElement("h2");
  title.className = "about-title";
  title.textContent = aboutData.title;
  container.append(title);

  const rsschoolElement = document.createElement("div");
  rsschoolElement.className = "rsschool";

  const rsschoolLink = document.createElement("a");
  rsschoolLink.className = "rsschool-link";
  rsschoolLink.target = "_blank";
  rsschoolLink.href = "https://rs.school/courses/javascript";
  rsschoolLink.rel = "noopener noreferrer";
  rsschoolElement.append(rsschoolLink);

  const parser = new DOMParser();
  const rsschoolDocument = parser.parseFromString(logoInline, "image/svg+xml");

  const rsschoolImg = rsschoolDocument.documentElement;
  rsschoolImg.classList.add("rsschool-logo");
  rsschoolImg.setAttribute("title", "RS School");

  const rsschoolName = document.createElement("span");
  rsschoolName.className = "rsschool-name";
  rsschoolName.textContent = "Rolling Scopes School";
  rsschoolLink.append(rsschoolImg, rsschoolName);
  container.append(rsschoolLink);

  const description = document.createElement("p");
  description.className = "about-description";
  description.textContent = aboutData.description;
  container.append(description);

  const teamContainer = document.createElement("div");
  teamContainer.className = "team-container";

  for (const member of aboutData.members) {
    teamContainer.append(createMemberCard(member));
  }

  container.append(teamContainer);

  const projectDesc = document.createElement("p");
  projectDesc.className = "project-description";
  projectDesc.textContent = aboutData.projectDescription;
  container.append(projectDesc);

  return container;
}
