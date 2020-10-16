import { BaseControl, FocalPointPicker, PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { LayoutSelector } from '../../components/enform/LayoutSelector/LayoutSelector';
import { URLInput } from "../../components/URLInput/URLInput";
import {FormHelp} from '../../components/enform/FormHelp/FormHelp';
import { ImageOrButton } from '../../components/ImageOrButton/ImageOrButton';

const {getCurrentPostType} = wp.data.select("core/editor");
const { __ } = wp.i18n;

const BLOCK_NAME = 'planet4-blocks/enform';
const home_page = window.p4en_vars.home;

export const ENFormSettings = ({attributes, setAttributes}) => {
    
  const {
    en_page_id,
    en_form_id,
    en_form_style,
    className,
    enform_goal,
    donate_button_checkbox,
    thankyou_url,
    campaign_logo,
    background,
    background_image_src,
    background_image_srcset,
    background_image_sizes,
    background_image_focus,
  } = attributes;

  console.log(attributes);

  let flattenedPages = [];
  let pagesByType;

  for (var i in window.p4en_vars.pages) {
    pagesByType = window.p4en_vars.pages[i].map(page => {
      return { label: page.name, value: page.id };
    });
    flattenedPages = flattenedPages.concat(
      { label: '-- ' + i, value: i }, // Page type label
      ...pagesByType
    );
  }

  const en_forms = window.p4en_vars.forms.map(form => {
    return { label: form.post_title, value: form.ID };
  });


  const is_campaign = getCurrentPostType() === "campaign";

  const toAttribute = attributeName => value => {
    setAttributes( { [ attributeName ]: value } );
  };

  const onBackgroundChange = (image) => {
    console.log(background, image);
    setAttributes({
      background: image.id,
      background_image_src: image.url,
    });
  }
  const onFocalChange = (focal_name, {x,y}) => {
    setAttributes({[focal_name]: `${parseInt(x*100)}% ${parseInt(y*100)}%`});
  }
  const focus_bg_image_obj = convertFocalStringToObj(background_image_focus || null);
  const focal_picker_dimensions = {width: 400, height: 100};


  return (
    <InspectorControls>
      <PanelBody title={__('Form settings', 'planet4-blocks-backend')}>
        <div>
          {is_campaign &&
            <ToggleControl 
              label={__( 'Use campaign logo', 'planet4-engagingnetworks-backend' )}
              value={campaign_logo}
              checked={campaign_logo}
              onChange={toAttribute('campaign_logo')}
            />
          }
          <SelectControl
            label={__( 'Engaging Network Live Pages', 'planet4-engagingnetworks-backend' )}
            value={en_page_id}
            options={[
              { label: 'No pages', value: 0 },
              ...flattenedPages
            ]}
            disabled={!flattenedPages.length}
            onChange={toAttribute('en_page_id')}
            required={true}
          />

          <SelectControl
            label={__( 'Select Goal', 'planet4-engagingnetworks-backend' )}
            value={enform_goal}
            options={[
              { label: __( '--- Select Goal ---', 'planet4-engagingnetworks-backend' ), value: 'not set' },
              { label: 'Petition Signup', value: 'Petition Signup' },
              { label: 'Action Alert', value: 'Action Alert' },
              { label: 'Contact Form', value: 'Contact Form' },
              { label: 'Other', value: 'Other' },
            ]}
            onChange={toAttribute('enform_goal')}
          />
          
          <SelectControl
            label={__( 'Planet 4 Engaging Networks form', 'planet4-engagingnetworks-backend' )}
            value={ en_form_id }
            options={[
              { label: 'No forms', value: 0 },
              ...en_forms
            ]}
            onChange={(id) => {setAttributes({en_form_id: parseInt(id)})}}
            help={en_forms.length > 0
              ? __( 'Select the P4EN Form that will be displayed.', 'planet4-engagingnetworks-backend' )
              : __( 'Create an EN Form', 'planet4-engagingnetworks-backend' )}
          />

          <BaseControl
            id="enform-bg-img-control"
            label={__('Select background image', 'planet4-blocks-backend')}
            help={__('(Optional)', 'planet4-blocks-backend')}
          >
            <ImageOrButton
              title={__('Select background image', 'planet4-blocks-backend')}
              onSelectImage={(image) => {onBackgroundChange(image)}}
              imageId={background}
              imageUrl={background_image_src}
              buttonLabel={__('+ Select background image', 'planet4-blocks-backend')}
              disabled={false}
            />
            {background_image_src &&
              <div>
                {__('Select focal point for background image', 'planet4-blocks-backend')}
                <FocalPointPicker
                  url={background_image_src}
                  dimensions={focal_picker_dimensions}
                  value={focus_bg_image_obj}
                  onChange={(focus) => {onFocalChange('background_image_focus', focus)}}
                />
              </div>
            }
          </BaseControl>
        </div>
      </PanelBody>

      <PanelBody title={__('Thank You note settings', 'planet4-blocks-backend')}>
        <ToggleControl 
          label={__( 'Hide "DONATE" button in Thank You message', 'planet4-engagingnetworks-backend' )}
          value={donate_button_checkbox}
          checked={donate_button_checkbox}
          onChange={toAttribute('donate_button_checkbox')}
        />

        <URLInput
          label={ __( 'Page URL', 'planet4-engagingnetworks-backend' ) }
          placeholder={ __( 'Enter "Thank you page" url', 'planet4-engagingnetworks-backend' ) }
          value={thankyou_url}
          onChange={toAttribute('thankyou_url')}
          help={ __('Title, Subtitle, Social media message / icons and DONATE will not be shown', 'planet4-engagingnetworks-backend') }
        />
      </PanelBody>
    </InspectorControls>
  )
}

/**
 * Convert focal point values from : 10% 80% => {x:0.1, y:0.8}
 * @param {string} focal_str 
 */
const convertFocalStringToObj = (focal_str) => {
  if (!focal_str || focal_str.length <= 0) {
    return {x: 0.5,y: 0.5};
  }
  let [x, y] = focal_str.replace(/\%/g, '').split(' ');
  return {x: (parseInt(x)/100), y: (parseInt(y)/100)};
}