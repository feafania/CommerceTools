import "./about.css";
import { SETTINGS } from "@/config/settings";
import { AboutData, AboutMember } from "@/types/types";
import { createRSSchoolLink } from "@/components/rsschool-link/rsschool-link";

function getAboutData(): AboutData {
  const label = SETTINGS.label.about;

  return {
    title: label.title,
    description: label.description,
    projectDescription: label.projectDescription,
    members: [
      {
        id: 1,
        name: label.name1,
        photo: label.photo1,
        bio: label.bio1,
        role: label.role1,
        tasks: label.tasks1,
        github: label.github1,
      },
      {
        id: 2,
        name: label.name2,
        photo: label.photo2,
        bio: label.bio2,
        role: label.role2,
        tasks: label.tasks2,
        github: label.github2,
      },
    ],
  };
}

function createMemberPhoto(member: AboutMember): HTMLImageElement {
  const photo = new Image();
  photo.src = member.photo;
  photo.alt = `${member.name}'s profile`;
  photo.className = "member-photo";
  return photo;
}

function createMemberInfo(member: AboutMember): HTMLElement {
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
  role.textContent = `${SETTINGS.label.about.role}: ${member.role}`;
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

function createMemberCard(member: AboutMember): HTMLElement {
  const memberCard = document.createElement("div");
  memberCard.className = "member-card";

  memberCard.append(createMemberPhoto(member));
  memberCard.append(createMemberInfo(member));

  const tasksTitle = document.createElement("h4");
  tasksTitle.className = "tasks-title";
  tasksTitle.textContent = SETTINGS.label.about.tasksDone + ":";
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
  title.textContent = getAboutData().title;
  container.append(title);

  container.append(createRSSchoolLink());

  const teamContainer = document.createElement("div");
  teamContainer.className = "team-container";

  for (const member of getAboutData().members) {
    teamContainer.append(createMemberCard(member));
  }
  container.append(teamContainer);

  const description = document.createElement("p");
  description.className = "about-description";
  description.textContent = getAboutData().description;
  container.append(description);

  const projectDesc = document.createElement("p");
  projectDesc.className = "project-description";
  projectDesc.textContent = getAboutData().projectDescription;
  container.append(projectDesc);

  return container;
}
