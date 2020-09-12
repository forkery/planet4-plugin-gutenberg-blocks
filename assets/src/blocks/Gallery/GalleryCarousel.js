import { useState, useEffect, useRef } from '@wordpress/element';

const { __ } = wp.i18n;

export const GalleryCarousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(null);
  const [order, setOrder] = useState('next');
  const [transitioning, setTransitioning] = useState(false);

  const lastSlide = images.length - 1;

  const goToSlide = newSlide => {
    if (newSlide !== currentSlide) {
      const newOrder = newSlide > currentSlide ? 'next' : 'prev';
      if (order !== newOrder) {
        setOrder(newOrder);
      }
      setTransitioning(true);
      setNextSlide(newSlide);
      setTimeout(() => {
        setCurrentSlide(newSlide);
        setNextSlide(newSlide === lastSlide ? 0 : newSlide + 1);
        if (order !== 'next') {
          setOrder('next');
        }
        setTransitioning(false);
      }, 500);
    }
  }

  const goToNextSlide = () => goToSlide(currentSlide === lastSlide ? 0 : currentSlide + 1);
  const goToPrevSlide = () => goToSlide(currentSlide === 0 ? lastSlide : currentSlide - 1);

  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(goToNextSlide, 10000);
    return () => clearTimeout(timerRef.current);
  }, [currentSlide]);

  return (
    <div className="carousel slide">
      {images.length > 1 &&
        <ol className="carousel-indicators">
          {images.map((image, index) =>
            <li
              key={`indicator-${index}`}
              onClick={() => goToSlide(index)}
              className={index === currentSlide ? 'active' : ''}
            />
          )}
        </ol>
      }
      <div className="carousel-inner" role="listbox">
        {images.length > 1 &&
          <a className="carousel-control-prev" role="button" onClick={goToPrevSlide}>
            <span className="carousel-control-prev-icon" aria-hidden="true"><i></i></span>
            <span className="sr-only">{__('Previous', 'planet4-blocks')}</span>
          </a>
        }
        {images.map((image, index) => {
	  let className = `carousel-item`;
	  if (transitioning) {
            if (index === nextSlide) {
	      className += ` carousel-item-${order} carousel-item-${order === 'next' ? 'left' : 'right'}`;
	      //className += ` active`
	    }  else if (index === currentSlide) {
              className += ` active carousel-item-${order === 'next' ? 'left' : 'right'}`;
            }
          } else {
	    className += ` ${index === currentSlide ? 'active' : ''}`
	  }
          return (
            <div
              key={image.image_src}
              className={className}
            >
              <img
                src={image.image_src}
                srcSet={image.image_srcset}
                sizes={image.image_sizes || 'false'}
                style={{ objectPosition: image.focus_image }}
                alt={image.alt_text}
              />

              {(image.caption || image.credits) && (
                <div className="carousel-caption">
                  <p>
                    {image.caption || image.credits}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {images.length > 1 && (
          <a className="carousel-control-next" role="button" onClick={goToNextSlide}>
            <span className="carousel-control-next-icon" aria-hidden="true"><i></i></span>
            <span className="sr-only">{__('Next', 'planet4-blocks')}</span>
          </a>
        )}
      </div>
    </div>
  );
}
