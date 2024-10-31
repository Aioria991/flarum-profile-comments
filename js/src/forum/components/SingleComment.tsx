import Component, {ComponentAttrs} from "flarum/common/Component";
import Mithril from "mithril";
import {SingleCommentProps} from "../types";

export default class SingleComment extends Component<SingleCommentProps> {
  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
  }

  oncreate(vnode: Mithril.VnodeDOM<ComponentAttrs, this>) {
    super.oncreate(vnode);
  }

  view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children {
    return (
      <div className="profile-comment-container">
        <div className="profile-comments-header">
          <div className="profile-comments">
            <img
              className="Avatar" loading="lazy" src={this.attrs.user?.avatarUrl()}
              alt=""/></div>
          <div className="profile-comment">
            <div>
              <span>{this.attrs.title}</span>
              <span>{this.attrs.commentedBy}</span>
            </div>
            <p>
              {this.attrs.comment}
            </p>
          </div>
        </div>

      </div>
    );
  }
}
