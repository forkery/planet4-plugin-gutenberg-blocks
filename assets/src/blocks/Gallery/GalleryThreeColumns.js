const ordinals = ['first', 'second', 'third'];

export const GalleryThreeColumns = ({ images, postType }) => (
  <div className="three-column-images row">
    {images.slice(0, 3).map((image, index) => (
      <div className="col" key={image.image_src}>
        <div className={`${ordinals[index]}-column split-image`}>
          {image.image_src &&
            <img
              src={image.image_src}
              srcSet={image.image_srcset}
              sizes={image.image_sizes || 'false'}
              style={{ objectPosition: image.focus_image }}
              alt={image.alt_text}
              className={`img_${postType}`}
            />
          }
        </div>
      </div>
    ))}
  </div>
);
