// @ts-nocheck
import Modal, {IInternalModalAttrs} from 'flarum/common/components/Modal';
import { getTranslation } from "../utils/getTranslation";
import Stream from 'flarum/common/utils/Stream';
import app from 'flarum/forum/app';
import Mithril from "mithril";

export default class AddCommentModal extends Modal {
  commentTitle = Stream('');
  comment = Stream('');

  oninit(vnode: Mithril.Vnode<IInternalModalAttrs, this>) {
    super.oninit(vnode);
    this.loading = false;
  }

  className() {
    return 'profile-comments-modal';
  }

  title() {
    return getTranslation('forum', 'createCommentModalTitle');
  }

   submitComment(e: { preventDefault: () => void; }) {
    e.preventDefault();
    this.loading = true;

    const title = this.commentTitle();
    const comment = this.comment();


    try {
      app.request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/user_comments`,
        body: {
          data: {
            attributes: {
              comment_title: title,
              comment: comment,
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: this.attrs.userId,
                },
              },
            },
          },
        },
      })
        .then(() => {
          this.loading = false
          app.alerts.show('success', getTranslation('forum', 'alertCommentCreated'))
        })

      this.hide();
    } catch (error) {
      app.alerts.show('error', getTranslation('forum', 'alertCommentError'))
    }
  }

  content() {
    return (
      <div>
        <form className="Form Form--centered add-profile-comment" onsubmit={this.submitComment.bind(this)}>
          <div className="Form-group">
            <input
              className="FormControl"
              name="comment_title"
              type="text"
              placeholder={getTranslation('forum', 'placeholderCommentTitle')}
              aria-label="comment_title"
              value={this.commentTitle()}
              oninput={(e: { target: { value: any; }; }) => this.commentTitle(e.target.value)}
            />
          </div>
          <div className="Form-group">
            <textarea
              className="FormControl"
              rows={8}
              name="comment"
              placeholder={getTranslation('forum', 'placeholderComment')}
              value={this.comment()}
              oninput={(e: { target: { value: any; }; }) => this.comment(e.target.value)}
            />
          </div>
          <div className="Form-group">
            <button disabled={this.loading} className="Button Button--primary Button--block" type="submit">
              <span className="Button-label">
                {getTranslation('forum', 'leaveComment')}
              </span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}
