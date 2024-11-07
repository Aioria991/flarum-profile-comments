import Notification from "flarum/forum/components/Notification";
import app from 'flarum/forum/app';
import Mithril from "mithril";

export default class NewProfileCommentNotification extends Notification {
  icon(): string {
    return "fas fa-comments";
  }

  href(): string {
    if (app.session.user) {
      return `${app.route.user(app?.session?.user)}/profile-comments`;
    } else {
      return '#'
    }
  }

  content(): Mithril.Children {
    return 'New profile comment from user';
  }

  excerpt(): Mithril.Children {
    return undefined;
  }
}
