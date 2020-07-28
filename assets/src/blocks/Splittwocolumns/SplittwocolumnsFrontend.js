import { Component, Fragment } from '@wordpress/element';

export class SplittwocolumnsFrontend extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      issue_description,
      issue_link_text,
      issue_link_path,
      issue_image_src,
      issue_image_srcset,
      issue_image_title,
      focus_issue_image,
      tag_name,
      tag_description,
      button_text,
      button_link,
      tag_image_src,
      tag_image_srcset,
      tag_image_title,
      focus_tag_image
    } = this.props.attributes

    let campaign_link_path="..."

    return (
      <Fragment>
      <section className="block-wide split-two-column">
        <div className="split-two-column-item item--left">
          {issue_image_src &&
            <div className="split-two-column-item-image">
              <img
                src={issue_image_src}
                alt={issue_image_title || ''}
                style={{objectPosition: focus_issue_image}}
              />
            </div>
          }
          <div className="split-two-column-item-content">
            {title && issue_link_path &&
              <h2 className="split-two-column-item-title">
                <a href={issue_link_path}>{title}</a>
              </h2>
            }
            {title && !issue_link_path &&
              <h2 className="split-two-column-item-title">{title}</h2>
            }
            {issue_description &&
              <p className="split-two-column-item-subtitle" 
                 dangerouslySetInnerHTML={{__html: issue_description}}
                 />
            }
            {issue_link_text && issue_link_path &&
              <a className="split-two-column-item-link" href={issue_link_path}>
                {issue_link_text}
              </a>
            }
          </div>
        </div>
		    <div className="split-two-column-item item--right">
          {tag_image_src &&
            <div className="split-two-column-item-image">
              <img
                src={tag_image_src}
                alt={tag_image_title || ''}
                style={{objectPosition: focus_tag_image}}
              />
            </div>
          }
          <div className="split-two-column-item-content">
            {tag_name &&
              <a className="split-two-column-item-tag" href={campaign_link_path}>
                #{tag_name}
              </a>
            }
            {tag_description &&
              <p className="split-two-column-item-subtitle">
                {tag_description}
              </p>
            }
            {button_text &&
              <a className="btn btn-small btn-primary btn-block split-two-column-item-button"
                 href={button_link}>
                {button_text}
              </a>
            }
          </div>
        </div>
      </section>
      </Fragment>
    )
  }
}

