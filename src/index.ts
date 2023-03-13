// IIFE to preserve code scope
(() => {
  // Enums
  enum NotificationPlatform {
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
  }

  // Utils
  const DateUtils = {
    tomorrow(): Date {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
    today(): Date {
      return new Date();
    },
    formatDate(date: Date): string {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    },
  };

  const UUID = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Interfaces
  interface Task {
    id: string;
    dateCreated: Date;
    dateUpdated: Date;
    description: string;
    render(): string;
  }

  class Reminder implements Task {
    id: string = UUID();
    dateCreated: Date = DateUtils.today();
    dateUpdated: Date = DateUtils.today();
    description: string = "";

    scheduleDate: Date = DateUtils.tomorrow();
    notifications: Array<NotificationPlatform> = [NotificationPlatform.EMAIL];

    constructor(
      description: string,
      scheduleDate: Date,
      notifications: Array<NotificationPlatform>
    ) {
      this.description = description;
      this.scheduleDate = scheduleDate;
      this.notifications = notifications;
    }

    render(): string {
      return `
      ---> Reminder <--- \n
      Description: ${this.description}\n
      Notify by ${this.notifications.join("and")} in ${DateUtils.formatDate(
        this.scheduleDate
      )}\n
      Created: ${DateUtils.formatDate(
        this.dateCreated
      )} Last Update: ${DateUtils.formatDate(this.dateUpdated)}      
      `;
    }
  }

  class Todo implements Task {
    id: string = UUID();
    dateCreated: Date = DateUtils.today();
    dateUpdated: Date = DateUtils.today();
    description: string = "";

    done: boolean = false;

    constructor(description: string) {
      this.description = description;
    }

    render(): string {
      const doneLabel = this.done ? "Completed" : "In Progress";
      return `
      ---> To do <--- \n
      Description: ${this.description}\n
      Status: ${doneLabel}\n
      Created: ${DateUtils.formatDate(this.dateCreated)}\n
      Last Update: ${DateUtils.formatDate(this.dateUpdated)} `;
    }
  }

  // Mocks
  const todoMock: Todo = new Todo("Help mark with code testing");

  const reminderMock: Reminder = new Reminder("My brother's bday", new Date(), [
    NotificationPlatform.EMAIL,
  ]);

  const taskView = {
    render(tasks: Array<Task>) {
      //Clear view
      const tasksList = document.getElementById("tasksList");
      while (tasksList?.firstChild) {
        tasksList.removeChild(tasksList.firstChild);
      }
      //Render Tasks
      //task.forEach((task) => console.log(JSON.stringfy(task)));

      tasks.forEach((task) => {
        const li = document.createElement("LI");
        const textNode = document.createTextNode(task.render());
        li.appendChild(textNode);
        tasksList?.appendChild(li);
      });
    },
  };

  // Controllers
  const TaskController = (view: typeof taskView) => {
    const tasks: Array<Task> = [todoMock, reminderMock];

    const handleTaskCreate = (event: Event) => {
      event.preventDefault();
      view.render(tasks);
    };

    document
      .getElementById("taskForm")
      ?.addEventListener("submit", handleTaskCreate);
  };

  TaskController(taskView);
})();
