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
import { getTranslation } from '../utils/getTranslation';
import LeaveCommentArea from '../components/LeaveCommentArea';

export default class UserCommentsPage extends UserPage {
  oninit(vnode: Mithril.Vnode<IUserPageAttrs, this>) {
    super.oninit(vnode);
    this.loading = false;
    // @ts-ignore
    this.comments = null;
    this.loadUser(this.attrs.username);
    this.getUserComments();
    this.userWhoCommented = null;
    this.refresh = false;
  }

  async getUserComments(): Promise<ApiResponsePlural<UserComment>> {
    this.loading = true;
    this.comments = await app.store.find('user_comments', {
      filter: { userId: this.user.id() },
    });
    this.loading = false;
    m.redraw();
  }

  async createComment(uid: string | number, title: string, comment: string) {
    this.loading = true;
    try {
      await app.request({
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
                  id: uid,
                },
              },
            },
          },
        },
      });

      m.redraw();
      app.alerts.show({ type: 'success' }, getTranslation('forum', 'alertCommentCreated'));
    } catch (error) {
      app.alerts.show('error', getTranslation('forum', 'alertCommentError'));
    } finally {
      this.loading = false;
    }
  }

  shouldRefresh() {
    this.refresh = this.refresh !== true;
    console.log('done', this.refresh);
  }

  oncreate(vnode: Mithril.VnodeDOM<IUserPageAttrs, this>) {
    super.oncreate(vnode);
    console.log('DOM updated');
    console.log(this.user.data.attributes.avatarUrl)
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
                          relToUser={comment.attributes.related_to_user}
                          refreshComments={this.getUserComments.bind(this)}
                        />
                      ))}
                  </div>
                  {this.user.id().toString() !== app.session.user.data.id ? (
                    <LeaveCommentArea
                      onInteraction={() => {
                        app.modal.show(AddCommentModal, {
                          userId: this.user.id(),
                          createComment: this.createComment,
                          refreshComments: this.getUserComments.bind(this),
                        });
                      }}
                      userAvatarUrl={this.user.data.attributes.avatarUrl}
                      placeholder={getTranslation('forum', 'leaveComment')}
                    />
                  ) : (
                    <LeaveCommentArea
                      userAvatarUrl={this.user.data.attributes.avatarUrl}
                      placeholder={getTranslation('forum', 'cantComment')}
                    />
                  )}
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
