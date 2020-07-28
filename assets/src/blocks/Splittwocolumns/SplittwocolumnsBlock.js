import { SplittwocolumnsEditor } from './SplittwocolumnsEditor';
import { frontendRendered } from '../frontendRendered';
import { withSelect } from '@wordpress/data';

const BLOCK_NAME = 'planet4-blocks/split-two-columns';

export class SplittwocolumnsBlock {
    constructor() {
      const { registerBlockType, unregisterBlockStyle, registerBlockStyle } = wp.blocks;
      const { __ } = wp.i18n;
      const { withSelect } = wp.data;
      const attributes = {
        select_issue: {
          type: 'number',
          default: 0
        },
        title: {
          type: 'string',
          default: ''
        },
        issue_description: {
          type: 'string',
          default: ''
        },
        issue_link_text: {
          type: 'string',
          default: ''
        },
        issue_link_path: {
          type: 'string',
          default: ''
        },
        issue_image_id: {
          type: 'number',
          default: 0
        },
        issue_image_src: {
          type: 'string',
          default: ''
        },
        issue_image_srcset: {
          type: 'string',
          default: ''
        },
        issue_image_title: {
          type: 'string',
          default: ''
        },
        focus_issue_image: {
          type: 'string',
          default: ''
        },
        select_tag: {
          type: 'number',
          default: 0
        },
        tag_name: {
          type: 'string',
          default: ''
        },
        tag_description: {
          type: 'string',
          default: ''
        },
        button_text: {
          type: 'string',
          default: ''
        },
        button_link: {
          type: 'string',
          default: ''
        },
        tag_image_id: {
          type: 'number',
          default: 0
        },
        tag_image_src: {
          type: 'string',
          default: ''
        },
        tag_image_srcset: {
          type: 'string',
          default: ''
        },
        tag_image_title: {
          type: 'string',
          default: ''
        },
        focus_tag_image: {
          type: 'string',
          default: ''
        },
      }

      registerBlockType( BLOCK_NAME, {
        title: __('Split Two Columns', 'planet4-blocks-backend'),
        icon: 'editor-table',
        category: 'planet4-blocks',
        attributes,
        deprecated: [{
          attributes,
          save() {
            return null;
          },
        }],
        edit: withSelect(select => {
          const {getEntityRecords} = select('core');

          return {
            issuesList: this.getIssues(getEntityRecords),
            tagsList: this.getTags(getEntityRecords)
          }
        })( ({issuesList, tagsList, isSelected, attributes, setAttributes}) => {
          return <SplittwocolumnsEditor
            attributes={attributes}
            setAttributes={setAttributes}
            isSelected={isSelected}
            issuesList={issuesList}
            tagsList={tagsList}
          />
        }),
        save: frontendRendered( BLOCK_NAME )
      });
    }

    getTags(getEntityRecords) {
      const taxonomy_args = {
        hide_empty: false,
        per_page: 50,
      };
      return getEntityRecords('taxonomy', 'post_tag', taxonomy_args)
    }

    getIssues(getEntityRecords) {
      const parent_page = window.p4ge_vars.planet4_options.explore_page;
      const issue_page_args = {
        per_page: -1,
        sort_order: 'asc',
        sort_column: 'post_title',
        parent: parent_page,
        post_status: 'publish',
      };
      return getEntityRecords('postType', 'page', issue_page_args)
    }
}
