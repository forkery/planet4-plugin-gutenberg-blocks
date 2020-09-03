import { useState, useEffect } from '@wordpress/element';

const { apiFetch } = wp;
const { addQueryArgs } = wp.url;
const { useSelect } = wp.data;

const GALLERY_IMAGE_SIZES = {
  'slider': 'retina-large',
  'three-columns': 'medium_large',
  'grid': 'large'
};

const toSrcset = (set) => {
  let srcset = [];
  for (let size in set) {
    srcset.push(`${set[size].source_url} ${set[size].width}w`);
  }
  return srcset.join(', ');
};

const toSizes = (set, size) => {
  if (! set[size] ) {
    return false;
  }

  const width = set[size].width;
  return `(max-width: ${width}dpx) 100vw, ${width}dpx`;
}

const getCredit = (image) => {
  return image.meta?._credit_text
    ?? image.media_details?.image_meta?.credit
    ?? image.media_details?.image_meta?.copyright
    ?? '';
}

export const useGalleryImages = ({ multiple_image, gallery_block_focus_points }, layout) => {
  // const [ images, setImages ] = useState([]);
  const imageSize = GALLERY_IMAGE_SIZES[layout];

  const { images = [] } = useSelect((select) => {
    if (!multiple_image) {
      return { images: [] };
    }
    
    let img_list = select('core').getMediaItems({include: multiple_image}) || [];
    return {
      images: img_list.map((image) => {
        return {
          alt_text: image.alt_text ?? '',
          caption: image.caption?.raw ?? '',
          credits: getCredit(image),
          focus_image: '',
          image_sizes: toSizes(image.media_details?.sizes ?? {}, imageSize),
          image_src: image.source_url ?? '',
          image_srcset: toSrcset(image.media_details?.sizes ?? {}),
        }
      })
    };
  });

  // setImages(images);

  return { images };
};
