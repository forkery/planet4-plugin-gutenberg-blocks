import { Component, Fragment } from '@wordpress/element';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import {
  TextControl,
  FocalPointPicker,
  PanelBody,
  SelectControl
} from '@wordpress/components';
import { ImageOrButton } from '../../components/ImageOrButton/ImageOrButton';
import { URLInput } from "../../components/URLInput/URLInput";
import { SplittwocolumnsFrontend } from './SplittwocolumnsFrontend';
import { debounce } from 'lodash';

const { __ } = wp.i18n;

export class SplittwocolumnsEditor extends Component {
  constructor(props) {
    super(props);
    this.toAttribute = this.toAttribute.bind(this);
  }

  toAttribute(attributeName) {
    const {setAttributes} = this.props;
    return value => {
      setAttributes({[attributeName]: value});
    }
  }

  debounceToAttribute(attributeName, delay = 400) {
    const {setAttributes} = this.props;
    return debounce(value => {
      setAttributes({[attributeName]: value});
    }, delay)
  }

  setLists() {
    // Issues list for selector
    const issues = this.props.issuesList || [];
    this.issue_page_list = issues.map((issue) => ({label: issue.title.raw, value: issue.id}));
    this.issue_page_list.unshift({label: '--Select Issue--', value: 0});
    // Tags list for selector
    const tags = this.props.tagsList || [];
    this.tag_list = tags.map((tag) => ({label: tag.name, value: tag.id}));
    this.tag_list.unshift({label: '--Select Tag--', value: 0});
  }

  issueChange(issue_id) {
    issue_id = parseInt(issue_id);
    const { attributes } = this.props;
    const issuesList = this.props.issuesList || [];
    const current_issue = issuesList.find(issue => issue.id === issue_id) || null;
    const {setAttributes} = this.props;
    setAttributes({
      'select_issue': parseInt(issue_id),
      'issue_link_path': current_issue.link || null,
      'issue_link_text': __('Learn more about this issue', 'planet4-blocks'),
      'title': current_issue.cmb2.p4_metabox.p4_title 
        || current_issue.title.raw.substr(0, 40) || attributes.title,
      'issue_description': current_issue.cmb2.p4_metabox.p4_description.replace(/<[^>]+>/g, '').substr(0, 300) 
        || attributes.issue_description
    });
  }

  tagChange(tag_id) {
    tag_id = parseInt(tag_id);
    const { attributes } = this.props;
    const tagsList = this.props.tagsList || [];
    const current_tag = tagsList.find(tag => tag.id === tag_id) || null

    const {setAttributes} = this.props;
    setAttributes({
      'select_tag': tag_id,
      'tag_name': current_tag.name || null,
      'tag_description': current_tag.description.substr(0, 300) || attributes.tag_description,
      'button_text': attributes.button_text.length > 0 
        ? attributes.button_text : __( 'Get Involved', 'planet4-blocks' ),
      'button_link': attributes.button_link.length > 0 
        ? attributes.button_link : current_tag.link
    });
  }

  imageChange(image_type, image) {
    const {setAttributes} = this.props;
    setAttributes({
      [image_type + '_id']: image.id,
      [image_type + '_src']: image.url,
      [image_type + '_srcset']: '',
      [image_type + '_title']: image.title
    });
  }

  focusChange(focus_type, {x,y}) {
    const {setAttributes} = this.props;
    setAttributes({[focus_type]: parseInt(x*100)+'% '+parseInt(y*100)+'%' });
  }

  renderInPlaceEdit() {
    const { attributes } = this.props;

    let campaign_link_path="..."

    return (
      <Fragment>
      <section className="block-wide split-two-column">
        <div className="split-two-column-item item--left">
          {attributes.issue_image_src &&
            <div className="split-two-column-item-image">
              <img
                src={attributes.issue_image_src}
                alt={attributes.issue_image_title || ''}
                style={{objectPosition: attributes.focus_issue_image}}
              />
            </div>
          }
          <div className="split-two-column-item-content">
            <RichText
              tagName="h2"
              className="split-two-column-item-title"
              placeholder={__('Enter Title', 'planet4-blocks-backend')}
              value={attributes.title}
              onChange={this.debounceToAttribute('title')}
              help={__('(Optional) Fill this only if you need to override issue title.', 'planet4-blocks-backend')}
              characterLimit={40}
              multiline={false}
              withoutInteractiveFormatting
              />
            <RichText
              tagName="p"
              className="split-two-column-item-subtitle"
              placeholder={__('Enter Description', 'planet4-blocks-backend')}
              help={__('(Optional) Fill this only if you need to override issue description.', 'planet4-blocks-backend')}
              value={attributes.issue_description}
              onChange={this.debounceToAttribute('issue_description')}
              characterLimit={300}
              multiline={false}
              allowedFormats={['core/bold', 'core/italic']}
              />  
            {attributes.issue_link_path &&
              <RichText
                tagName="a"
                className="split-two-column-item-link"
                placeholder={__('Enter Link Text', 'planet4-blocks-backend')}
                value={attributes.issue_link_text}
                onChange={this.debounceToAttribute('issue_link_text')}
                characterLimit={100}
                multiline={false}
                withoutInteractiveFormatting
                />
            }
          </div>
        </div>
		    <div className="split-two-column-item item--right">
          {attributes.tag_image_src &&
            <div className="split-two-column-item-image">
              <img
                src={attributes.tag_image_src}
                alt={attributes.tag_image_title || ''}
                style={{objectPosition: attributes.focus_tag_image}}
              />
            </div>
          }
			    <div className="split-two-column-item-content">
            {attributes.tag_name &&
              <a className="split-two-column-item-tag" href={campaign_link_path}>
                #{attributes.tag_name}
              </a>
            }
            <RichText
              tagName="p"
              className="split-two-column-item-subtitle"
              placeholder={__('Enter Description', 'planet4-blocks-backend')}
              help={__('(Optional)', 'planet4-blocks-backend')}
              value={attributes.tag_description}
              onChange={this.debounceToAttribute('tag_description')}
              characterLimit={300}
              multiline={false}
              allowedFormats={['core/bold', 'core/italic']}
              />
            <RichText
              tagName="a"
              className="btn btn-small btn-primary btn-block split-two-column-item-button"
              placeholder={__('Enter button text', 'planet4-blocks-backend')}
              help={__('(Optional)', 'planet4-blocks-backend')}
              value={attributes.button_text}
              onChange={this.debounceToAttribute('button_text')}
              withoutInteractiveFormatting
              characterLimit={50}
              multiline={false}
              allowedFormats={[]}
              />
          </div>
        </div>
      </section>
      </Fragment>
    )
  }

  renderSettingsEdit() {
    const { attributes } = this.props;
    const tag_list = this.tag_list;
    const issue_page_list = this.issue_page_list;

    // Convert focal point values from : 10% 80% => {x:0.1, y:0.8}
    let focus_issue_image_obj = {x: 0.5,y: 0.5};
    if (attributes.focus_issue_image) {
      let [x,y] = attributes.focus_issue_image.replace(/\%/g, '').split(' ');
      focus_issue_image_obj = {x: (parseInt(x)/100), y: (parseInt(y)/100)}
    }

    // Convert focal point values from : 10% 80% => {x:0.1, y:0.8}
    let focus_tag_image_obj = {x: 0.5,y: 0.5};
    if (attributes.focus_tag_image) {
      let [x,y] = attributes.focus_tag_image.replace(/\%/g, '').split(' ');
      focus_tag_image_obj = {x: (parseInt(x)/100), y: (parseInt(y)/100)}
    }

    const dimensions = {width: 400, height: 100};

    return (
      <InspectorControls>
          <PanelBody title={__('Setting', 'planet4-blocks-backend')}>
            <div>
              {issue_page_list &&
                <SelectControl
                  label={__('Select an issue', 'planet4-blocks-backend')}
                  value={attributes.select_issue}
                  options={issue_page_list}
                  onChange={ (issue_id) => { this.issueChange(issue_id) } }
                />
               }
            </div>
            <div>
              <URLInput
                label={__('Issue link path', 'planet4-blocks-backend')}
                placeholder={__('Enter link path', 'planet4-blocks-backend')}
                value={attributes.issue_link_path}
                onChange={this.toAttribute('issue_link_path')}
                help={__('(Optional)', 'planet4-blocks-backend')}
              />
            </div>
            <div>
              {__('Issue Image', 'planet4-blocks-backend')}
              <ImageOrButton
                title={__('Select Image for Issue', 'planet4-blocks-backend')}
                onSelectImage={(image) => {this.imageChange('issue_image', image)}}
                imageId={attributes.issue_image_id}
                imageUrl={attributes.issue_image_src}
                buttonLabel={__('+ Select Image for Issue', 'planet4-blocks-backend')}
                help={__('(Optional)', 'planet4-blocks-backend')}
                imgClass='splittwocolumns-block-issue-imgs'
              />
            </div>
            {attributes.issue_image_src &&
            <div>
              {__('Select focal point for issue image', 'planet4-blocks-backend')}
              <FocalPointPicker
                url={attributes.issue_image_src}
                dimensions={dimensions}
                value={focus_issue_image_obj}
                onChange={(focus) => {this.focusChange('focus_issue_image', focus)}}
              />
              {__('(Optional)', 'planet4-blocks-backend')}
            </div>
            }
            <hr/>
            <div>
              {tag_list &&
                <SelectControl
                  label={__('Select a tag', 'planet4-blocks-backend')}
                  value={attributes.select_tag}
                  options={tag_list}
                  onChange={ (tag_id) => { this.tagChange(tag_id) } }
                />
              }
            </div>
            <div>
              <URLInput
                label={__('Campaign button link', 'planet4-blocks-backend')}
                placeholder={__('Enter button link', 'planet4-blocks-backend')}
                value={attributes.button_link}
                onChange={this.toAttribute('button_link')}
                help={__('(Optional)', 'planet4-blocks-backend')}
              />
            </div>
            <div>
              {__('Campaign Image', 'planet4-blocks-backend')}
              <ImageOrButton
                title={__('Select Image for Campaign', 'planet4-blocks-backend')}
                onSelectImage={(image) => {this.imageChange('tag_image', image)}}
                imageId={attributes.tag_image_id}
                imageUrl={attributes.tag_image_src}
                buttonLabel={__('+ Select Image for Campaign', 'planet4-blocks-backend')}
                help={__('(Optional)', 'planet4-blocks-backend')}
                imgClass='splittwocolumns-block-tag_imgs'
              />
              {attributes.tag_image_src &&
              <div>
                {__('Select focal point for campaign image', 'planet4-blocks-backend')}
                <FocalPointPicker
                  url={attributes.tag_image_src}
                  dimensions={dimensions}
                  value={focus_tag_image_obj}
                  onChange={(focus) => {this.focusChange('focus_tag_image', focus)}}
                />
                {__('(Optional)', 'planet4-blocks-backend')}
              </div>
              }
            </div>
          </PanelBody>
        </InspectorControls>
    )
  }

  renderEdit() {
    this.setLists();

    return (
      <Fragment>
        { this.renderInPlaceEdit() }
        { this.renderSettingsEdit() }
      </Fragment>
    );
  }

  renderView() {
    return (
      <Fragment>
        <SplittwocolumnsFrontend {...this.props} />
      </Fragment>
    )
  }

  render() {
    return (
      <Fragment>
        {this.props.isSelected ? this.renderEdit() : this.renderView()}
      </Fragment>
    );
  }
}
