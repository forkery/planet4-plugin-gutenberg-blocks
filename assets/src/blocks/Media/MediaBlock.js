import { MediaEditor } from './MediaEditor';
import { StaticMediaFrontend } from './MediaFrontend';

const {__} = wp.i18n;

const BLOCK_NAME = 'planet4-blocks/media-video';

const attributes = {
  video_title: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  youtube_id: {
    type: 'string'
  },
  video_poster_img: {
    type: 'integer'
  },
};

export class MediaBlock {
    constructor() {
      const {registerBlockType} = wp.blocks;

      registerBlockType(BLOCK_NAME, {
        title: __('Media block', 'planet4-blocks-backend'),
        icon: 'format-video',
        category: 'planet4-blocks',
        deprecated: [{
          attributes,
          save: () => {
            return null
          }
        }],
        attributes: {
          ...attributes,
          embedHtml: {
            type: 'string',
            default: ''
          },
          posterURL: {
            type: 'string',
            default: ''
          },
        },
        save: ({ attributes }) => {
          return <StaticMediaFrontend { ...attributes } />
        },
        edit: MediaEditor,
      });
    };
}
