import {ENFormFrontend as Frontend} from './ENFormFrontend';
import {ENFormInPlaceEdit as InPlaceEdit} from './ENFormInPlaceEdit';
import {ENFormSettings as SidebarSettings} from './ENFormSettings';
import { Component, Fragment } from '@wordpress/element';

import { useSelect } from '@wordpress/data';


export const ENFormEditor = ({ attributes, setAttributes, isSelected }) => {

  const { en_form_style, className } = attributes;

  // todo: better legacy handling
  if ( className && className.length > 0 ) {
    console.log('style', className, en_form_style, className.replace('is-style-', ''));
    setAttributes({
      en_form_style: className.replace('is-style-', '')
    });
  }

  if (! en_form_style || en_form_style.length <= 0) {
    setAttributes({en_form_style: 'side-style'});
  }

  return (
    isSelected
      ? renderEdit({attributes}, setAttributes) 
      : renderView({attributes})
  );
}

const renderView = ({attributes}) => <Frontend {...{attributes}} />

const renderEdit = ({attributes}, setAttributes) => {
  const charLimit = { title: 40, description: 400 };
  const params = {attributes, charLimit, setAttributes};

  const { background, background_image_src } = attributes;

  if (background_image_src.length <= 0 && background > 0) {
    setAttributes({
      background_image_src: useSelect((select) => {
        let img = select('core').getMedia(background);
        return img?.source_url || '';
      })
    })
  }

  return (
    <Fragment>
      <InPlaceEdit {...params} />
      <SidebarSettings  {...params} />
    </Fragment>
  );
}

