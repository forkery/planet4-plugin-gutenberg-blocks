import { MediaEmbedPreview } from './MediaEmbedPreview';
import { MediaElementVideo } from './MediaElementVideo';
import { useMediaDataFetch } from './useMediaDataFetch';

const { __ } = wp.i18n;

const wrapAndRemoveSize = embedHtml => {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.innerHTML = embedHtml;
  if (wrapperDiv.firstChild && wrapperDiv.firstChild.src && wrapperDiv.firstChild.src.indexOf('youtube') > -1) {
    wrapperDiv.className = 'embed-container';
    wrapperDiv.firstChild.removeAttribute('width');
    wrapperDiv.firstChild.removeAttribute('height');
    return wrapperDiv.outerHTML;
  } else {
    return embedHtml;
  }
}

export const MediaFrontend = (props) => {
  const mediaData = useMediaDataFetch(props);

  const staticProps = { ...props, ...mediaData };

  return <StaticMediaFrontend { ...staticProps } />
}

export const StaticMediaFrontend = (props) => {
  const {
    video_title,
    description,
    video_poster_img,
    embedHtml,
    posterURL,
    youtube_id,
  } = props;

  const wrappedHtml = wrapAndRemoveSize(embedHtml);

  return (
    <section className="block media-block">
      <div className="container">
        {
          video_title &&
          <header>
            <h2 className="page-section-header">{ video_title }</h2>
          </header>
        }
        {
          description &&
          <div className="page-section-description" dangerouslySetInnerHTML={{ __html: description }} />
        }
        {
          youtube_id && youtube_id.endsWith('.mp4')
          ? <MediaElementVideo videoURL={ youtube_id } videoPoster={ posterURL } />
          : <MediaEmbedPreview html={ wrappedHtml || null } />
        }
      </div>
    </section>
  );
};
