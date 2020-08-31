import { SvgIcon } from './SvgIcon';
const { __ } = wp.i18n;

export const ShareButtonsFrontend = (social, accounts, sprite = '') => {
  const {
    link,
    title,
    description
  } = social;

  const dataLayer = [];
  const share = (action, label) => {
    dataLayer.push({
      event: 'uaevent', 
      eventCategory: 'Social Share',
      eventAction: action,
      eventLabel: label
    })
  }

  return (
    <div className="share-buttons">
      <a href={ `https://wa.me/?text=${link}` }
        onClick={share('Whatsapp', link)}
        target="_blank" 
        className="share-btn whatsapp"
      >
        <SvgIcon {...{name: "whatsapp"}} />
        <span className="sr-only">{__( 'Share on', 'planet4-master-theme' )} Whatsapp</span>
      </a>

      <a href={ `https://www.facebook.com/sharer/sharer.php?u=${link}` }
        onClick={share('Facebook', link)}
        target="_blank"
        className="share-btn facebook"
      >
        <SvgIcon {...{name: "facebook-f"}} />
        <span className="sr-only">{__( 'Share on', 'planet4-master-theme' )} Facebook</span>
      </a>

      <a href={ `https://twitter.com/share?url=${link}&text=${title}${social.description ? ` - ${social.description}` : ''} via @${accounts.twitter}&related=${accounts.twitter}` }
        onClick={share('Twitter', link)}
        target="_blank"
        className="share-btn twitter"
      >
        <SvgIcon {...{name: "twitter"}} />
        <span className="sr-only">{__( 'Share on', 'planet4-master-theme' )} Twitter</span>
      </a>

      <a href={`mailto:?subject=${title}&body=${social.description ? social.description : ''}${social.link}`}
        onClick={share('Email', link)}
        target="_blank"
        className="share-btn email"
      >
        <SvgIcon {...{name: "envelope"}} />
        <span className="sr-only">{__( 'Share via', 'planet4-master-theme' )} Email</span>
      </a>
    </div>
  )
}