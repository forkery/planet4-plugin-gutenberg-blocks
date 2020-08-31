export const SvgIcon = (props) => {
  const theme_dir = '/wp-content/themes/planet4-master-theme';
  const {
    name,
    sprite = `${theme_dir}/images/symbol/svg/sprite.symbol.svg`,
  } = props;

  return (
    <svg viewBox="0 0 32 32" className="icon">
      <use xlinkHref={ `${sprite}#${name}` } />
    </svg>
  )
}
