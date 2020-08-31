import { ENFormGenerator } from './ENFormGenerator';
import { ShareButtonsFrontend } from './ShareButtonsFrontend';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

import {
	ToolbarButton,
	PanelBody,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';

const { RichText } = wp.editor;
const { __ } = wp.i18n;

export const ENFormInPlaceEdit = ({attributes, setAttributes}) => {
  const { 
    en_form_style,
    content_title_size,
  } = attributes;


  const is_side_style = en_form_style === 'side-style';

  const templates = [
    {
      id: "signup",
      icon: "format-aside",
      title: "Signup form",
    },
    {
      id: "thankyou",
      icon: "awards",
      title: "Thank You message",
    }
  ];
  const [activeTplId, setActiveTplId] = useState('signup');
  const activeTpl = templates.find((tpl) => {return tpl.id === activeTplId});

  return (
    <>
    <BlockControls>
      <ToolbarGroup
        isCollapsed={ true }
        icon={ activeTpl.icon }
        label={ activeTpl.title }
        controls={
          templates.map((tpl) => {
            const isActive = activeTplId === tpl.id;
            return {
              isActive,
              icon: tpl.icon,
              title: tpl.title,
              onClick: () => { setActiveTplId(tpl.id) }
            }
          })
        }
      />
    </BlockControls>
    {activeTplId === 'signup' &&
      <Signup {...{attributes, setAttributes}} />
    }
    {activeTplId === 'thankyou' &&
      <ThankYou {...{attributes, setAttributes}} />
    }
    </>
  )
}

const Signup = ({attributes, setAttributes}) => {
  const { 
    en_form_style,
    background,
    background_image_src,
    background_image_srcset,
    background_image_sizes,
    background_image_focus,
    title,
    description,
    content_title,
    content_description,
    content_title_size,
    campaign_logo,
    thankyou_url,
    button_text,
    en_page_id,
    en_form_id,
    en_form_fields,
  } = attributes;

  const form_post = useSelect((select) => {
    return en_form_id
      ? select('core').getEntityRecord('postType', 'p4en_form', en_form_id)
      : [];
  });
  const form_fields = en_form_fields.length > 0 ? en_form_fields : (
    form_post?.p4enform_fields || []
  );
  
  const toAttribute = (attributeName) => {
    return value => {
      setAttributes({ [attributeName]: value });
    }
  }

  const style_has_image = en_form_style === 'full-width-bg' || en_form_style === 'side-style';
  const section_style = ((style) => {
    switch (style) {
      case 'side-style':
        return 'block-header block-wide';
      case 'full-width-bg':
        return 'block-footer block-wide';
      default:
        return '';
    }
  })(en_form_style);

  const is_side_style = en_form_style === 'side-style';

  console.log('style_has_image', style_has_image);

  return (
    <>
    <BlockControls>
      {is_side_style &&
        <ToolbarGroup
          isCollapsed={ true }
          icon="heading"
          label={content_title_size.toUpperCase()}
          controls={
            ['h1', 'h2'].map((size) => {
              const isActive = content_title_size === size;
              return {
                isActive,
                icon: "heading",
                title: size.toUpperCase(),
                onClick: () => { setAttributes({content_title_size: size}) }
              }
            })
          }
        />
      }
    </BlockControls>
    <section 
      className={`block enform-wrap enform-${en_form_style} ${section_style}`}>
      {style_has_image && background &&
        <picture>
          <img src={ background_image_src || ''}
            style={{objectPosition: background_image_focus || {}}}
            border="0"
            srcSet={background_image_srcset || ''}
            sizes={background_image_sizes || ''}
            className={ background > 0 ? `wp-image-${background}` : ''}
          />
        </picture>
      }

      <div className="container">
        <div className="row">
          <div className="col-md-12">

            {en_form_style === 'side-style' &&
              <div className="form-caption">
                {campaign_logo &&
                  <img src={ campaign_logo }
                      alt={''}
                      className="campaign-logo" />
                }
                <RichText
                  tagName={content_title_size}
                  value={content_title}
                  onChange={toAttribute('content_title')}
                  placeholder={__('Enter title', 'planet4-blocks-backend')}
                  keepPlaceholderOnFocus={true}
                  withoutInteractiveFormatting
                  allowedFormats={[]}
                  characterLimit={60}
                  multiline="false"
                />
                <RichText
                  tagName="p"
                  value={content_description}
                  onChange={toAttribute('content_description')}
                  placeholder={__('Enter description', 'planet4-blocks-backend')}
                  keepPlaceholderOnFocus={true}
                  allowedFormats={['core/bold', 'core/italic', 'core/link']}
                  characterLimit={400}
                />
              </div>
            }

            <div className="enform">
              <div id="enform-content">

							  <div className="title-and-description">
                  <RichText 
                    tagName="h2"
                    value={title}
                    onChange={toAttribute('title')}
                    placeholder={__('Enter form title', 'planet4-blocks-backend')}
                    keepPlaceholderOnFocus={true}
                    withoutInteractiveFormatting
                    allowedFormats={[]}
                    characterLimit={60}
                    multiline="false"
                  />
                  {en_form_style === 'side-style' &&
                    <div className={'enform-extra-header-placeholder'}></div>
                  }

                  <RichText
                    tagName="div"
                    value={description}
                    className="form-description"
                    onChange={toAttribute('description')}
                    placeholder={__('Enter form description', 'planet4-blocks-backend')}
                    keepPlaceholderOnFocus={true}
                    allowedFormats={['core/bold', 'core/italic', 'core/link']}
                    characterLimit={400}
                  />
                </div>

                <div className="form-container">
                  { form(attributes, setAttributes, form_fields) }
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
    </>
  )
}

const ThankYou = ({attributes, setAttributes}) => {
  const { 
    en_form_style,
    thankyou_title,
    thankyou_subtitle,
    thankyou_donate_message,
    thankyou_social_media_message,
    donate_button_checkbox,
    donate_text,
    donatelink,
  } = attributes;

  const error = '';
  
  const toAttribute = (attributeName) => {
    return value => {
      setAttributes({ [attributeName]: value });
    }
  }

  const container_class = `thankyou ${en_form_style != 'side-style' ? 'full-width': ''}`;

  if (error) {
    return (
      <div className={container_class}>
        {error &&
          <span className="enform-error">{ error }</span>
        }
      </div>
    )
  }

  return (
    <div className={container_class}>
      <header>
        <RichText
          tagName="h2"
          className="page-section-header"
          value={ thankyou_title }
          onChange={toAttribute('thankyou_title')}
          placeholder={__('Enter title', 'planet4-blocks-backend')}
          keepPlaceholderOnFocus={true}
          withoutInteractiveFormatting
          allowedFormats={[]}
          characterLimit={60}
          multiline="false"
        />
      </header>
      <RichText
        tagName="p"
        className="page-section-description"
        value={ thankyou_subtitle }
        onChange={toAttribute('thankyou_subtitle')}
        placeholder={__('Enter description', 'planet4-blocks-backend')}
        keepPlaceholderOnFocus={true}
        allowedFormats={['core/bold', 'core/italic', 'core/link']}
        characterLimit={400}
        multiline="false"
      />

      <div className="sub-section formblock-flex">
        <div className="form-group">
          <RichText
            tagName="h5"
            className="page-section-header"
            value={ thankyou_social_media_message }
            onChange={toAttribute('thankyou_social_media_message')}
            placeholder={__('Enter social media message', 'planet4-blocks-backend')}
            keepPlaceholderOnFocus={true}
            withoutInteractiveFormatting
            allowedFormats={[]}
            characterLimit={400}
            multiline="false"
          />
        </div>

        <div className="social-media form-group">
          <ShareButtonsFrontend {...{social: {}, accounts: []}} />
        </div>

        {! donate_button_checkbox &&
          <>
            <div className="form-group">
              <RichText
                tagName="h5"
                className="page-section-header"
                value={ thankyou_donate_message }
                onChange={toAttribute('thankyou_sociathankyou_donate_messagel_media_message')}
                placeholder={__('Enter donate message', 'planet4-blocks-backend')}
                keepPlaceholderOnFocus={true}
                allowedFormats={['core/bold', 'core/italic', 'core/link']}
                characterLimit={400}
                multiline="false"
              />
            </div>
            
            <div className="form-group">
              <RichText
                tagName="a"
                href={ donatelink }
                className="btn btn-primary btn-block"
                value={donate_text}
                onChange={toAttribute('donate_text')}
                placeholder={__('Donate', 'planet4-blocks-backend')}
                keepPlaceholderOnFocus={true}
                withoutInteractiveFormatting
                allowedFormats={[]}
                characterLimit={60}
                multiline="false"
              />
            </div>
          </>
        }
      </div>
    </div>
  )
}

const form = (attributes, setAttributes, fields) => {
  const {
    button_text,
    text_below_button,
    en_form_style
  } = attributes;

  const full_width = en_form_style === 'full-width-bg';

  return (
    <form id="p4en_form" name="p4en_form">
      <div className={full_width ? 'row' : ''}>
        <ENFormGenerator {...{fields, attributes}} />
      </div>

      <div className={full_width ? 'col-md-4 submit' : 'submit'}>
        <RichText
          tag="button"
          id="p4en_form_save_button"
          className={'btn btn-primary btn-block' + (full_width ? ' w-auto' : '')}
          value={ button_text || __( 'Sign', 'planet4-engagingnetworks' ) }
          onChange={(text) => {setAttributes({button_text: text})}}
        />
        {full_width &&
          <div className="enform-legal">
            <RichText 
              tagName="p"
              value={text_below_button}
              placeholder={__('Text below button', 'planet4-blocks-backend')}
              keepPlaceholderOnFocus={true}
              allowedFormats={['core/bold', 'core/italic', 'core/link']}
              onChange={(text) => {setAttributes({text_below_button: text})}}
            />
          </div>
        }
      </div>
      {! full_width &&
        <div className="enform-legal">
          <RichText 
            tagName="p"
            value={text_below_button}
            placeholder={__('Text below button', 'planet4-blocks-backend')}
            keepPlaceholderOnFocus={true}
            allowedFormats={['core/bold', 'core/italic', 'core/link']}
            onChange={(text) => {setAttributes({text_below_button: text})}}
          />
        </div>
      }
    </form>
  )
}
