// @ts-nocheck
import UserPage, { IUserPageAttrs } from 'flarum/forum/components/UserPage';
import Mithril from 'mithril';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import app from 'flarum/forum/app';
import listItems from 'flarum/common/helpers/listItems';
import { ApiResponsePlural } from 'flarum/common/Store';
import UserComment from '../Models/UserComment';
import SingleComment from '../components/SingleComment';
import AddCommentModal from '../components/AddCommentModal';

export default class UserCommentsPage extends UserPage {
  oninit(vnode: Mithril.Vnode<IUserPageAttrs, this>) {
    super.oninit(vnode);
    // @ts-ignore
    this.loadUser(this.attrs.username);
    this.getUserComments();
    this.comments = null;
    this.userWhoCommented = null;
  }

  async getUserComments(): Promise<ApiResponsePlural<UserComment>> {
    const comments: ApiResponsePlural<UserComment> = await app.store.find('user_comments', {
      filter: { userId: this.user.id() },
    });
    this.comments = comments;
    m.redraw();
    return comments;
  }

  oncreate(vnode: Mithril.VnodeDOM<IUserPageAttrs, this>) {
    super.oncreate(vnode);
  }

  view(): JSX.Element {
    return (
      <div className="UserPage">
        {this.user ? (
          <div className="container">
            <div className="sideNavContainer">
              <nav className="sideNav UserPage-nav">
                <ul>{listItems(this.sidebarItems().toArray())}</ul>
              </nav>
              <div className="sideNavOffset UserPage-content">
                <div className="PostsUserPage">
                  <div className="profile-comment-actions">
                    <h2>{app.translator.trans('justoverclock-profile-comments.forum.commentsPageLink')}</h2>
                    <button
                      className="Button"
                      onclick={() => {
                        app.modal.show(AddCommentModal, { userId: this.user.id() });
                      }}
                    >
                      Create Comment
                    </button>
                  </div>
                  <div>
                    {this.comments &&
                      this.comments.payload.data.map((comment) => (
                        <SingleComment
                          user={this.user}
                          title={comment.attributes.comment_title}
                          comment={comment.attributes.comment}
                          commentedAt={comment.attributes.createdAt}
                          commentedBy={comment.attributes}
                          relToUser={comment.attribute}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LoadingIndicator display="block" />
        )}
      </div>
    );
  }
}
