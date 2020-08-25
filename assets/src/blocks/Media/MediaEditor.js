import { Fragment, useEffect, useState, useCallback } from "@wordpress/element";
import { PanelBody } from '@wordpress/components';
import { MediaPlaceholder } from "@wordpress/editor";
import { InspectorControls } from '@wordpress/block-editor';

import { URLInput } from "../../components/URLInput/URLInput";
import { MediaEmbedPreview } from "./MediaEmbedPreview";
import { MediaElementVideo } from './MediaElementVideo';
import { useSelect } from '@wordpress/data';
import { debounce } from 'lodash';

const { __ } = wp.i18n;
const { RichText } = wp.blockEditor;

const MediaInspectorOptions = ({ attributes, setAttributes }) => {
  // Using a state to prevent the input losing the cursor position, a React issue reported multiple times
  const [ mediaURL, setMediaURL ] = useState(attributes.youtube_id);
  const debouncedMediaURLUpdate = useCallback(debounce(value => setAttributes({ youtube_id: value }), 300), []);

  return <InspectorControls>
      <PanelBody title={__('Setting', 'planet4-blocks-backend')}>
        <URLInput
          label={__('Media URL/ID', 'planet4-blocks-backend')}
          placeholder={__('Enter URL', 'planet4-blocks-backend')}
          value={ mediaURL }
          onChange={
            value => {
              setMediaURL(value)
              debouncedMediaURLUpdate(value)
            }
          }
          help={__('Can be a YouTube, Vimeo or Soundcloud URL or an mp4, mp3 or wav file URL.', 'planet4-blocks-backend')}
        />
      </PanelBody>
    </InspectorControls>
  ;
}

const renderView = (props, toAttribute) => {
  const { attributes, setAttributes } = props;
  const { video_title, description, embedHtml, youtube_id, posterURL } = attributes;

  function onSelectImage({id}) {
    setAttributes({video_poster_img: id});
  }

  function onUploadError({message}) {
    console.log(message);
  }

  return (
    <Fragment>
      <header>
        <RichText
          tagName="h2"
          className="page-section-header"
          placeholder={__('Enter title', 'planet4-blocks-backend')}
          value={video_title}
          onChange={toAttribute('video_title')}
          keepPlaceholderOnFocus={true}
          withoutInteractiveFormatting
          characterLimit={40}
          multiline="false"
        />
      </header>
      <RichText
        tagName="p"
        className="page-section-description"
        placeholder={__('Enter description', 'planet4-blocks-backend')}
        value={description}
        onChange={toAttribute('description')}
        keepPlaceholderOnFocus={true}
        withoutInteractiveFormatting
        characterLimit={200}
      />
      <MediaPlaceholder
        labels={{ title: __('Video poster image [Optional]', 'planet4-blocks-backend'), instructions: __('Applicable for .mp4 video URLs only.', 'planet4-blocks-backend')}}
        icon="format-image"
        onSelect={ onSelectImage }
        onError={ onUploadError }
        accept="image/*"
        allowedTypes={["image"]}
      />
      {
        (youtube_id && !youtube_id.endsWith('.mp4')) && !embedHtml
        ? <div className="block-edit-mode-warning components-notice is-error">
            { __( 'The video URL could not be parsed.', 'planet4-blocks-backend' ) }
          </div>
        : <Fragment>
            {
              youtube_id && youtube_id.endsWith('.mp4')
              ? <MediaElementVideo videoURL={ youtube_id } videoPoster={ posterURL } />
              : <MediaEmbedPreview html={ embedHtml || null } />
            }
          </Fragment>
      }
    </Fragment>
  )
}

export const MediaEditor = (props) => {
  const { attributes, setAttributes, isSelected } = props;
  const { youtube_id, video_poster_img } = attributes;
  let mediaURL = youtube_id;

  const toAttribute = attributeName => value => setAttributes({ [attributeName]: value });

  // Assume that a non-URL is a YouTube video ID, for back compat.
  if ( youtube_id && youtube_id.indexOf('/') === -1 ) {
    mediaURL = `https://www.youtube.com/watch?v=${mediaURL}`;
  }

  if ( youtube_id && youtube_id.indexOf('youtube.com') > -1 ) {
    mediaURL.replace('youtube.com', 'youtube-nocookie.com');
  }

  const { embedHtml, posterURL } = useSelect((select) => {
    const embedPreview = select('core').getEmbedPreview( mediaURL );
    const media = select('core').getMedia(video_poster_img)
    return {
      embedHtml: embedPreview ? embedPreview.html : null,
      posterURL: media ? media.media_details.sizes.large.source_url : null
    }
  },
  [ youtube_id, video_poster_img ]);

  useEffect(() => {
    setAttributes({
      embedHtml: embedHtml || null,
      posterURL: posterURL || null
    })
  },
  [ embedHtml, posterURL ]);

  return (
    <div>
      { isSelected && <MediaInspectorOptions { ...props } /> }
      {
        renderView(props, toAttribute)
      }
    </div>
  );
}
