import { CountrySelector } from './CountrySelector';
import { PositionSelector } from './PositionSelector';

const { __ } = wp.i18n;

export const ENFormGenerator = ({fields, attributes}) => {
  return (
    // hidden fields
  
    <div className="formblock-flex donations-formsection-info">
      {fields.map((field, index) => getInput(field, index, attributes))}
    </div>
  );
}

const getInput = (field, index, attributes) => {
  const { en_form_style } = attributes;
  const is_side_style = 'side-style' === en_form_style;

  return ((field) => {
    switch (field.input_type) {
      case 'text':
      case 'email':
        return getTextInput(field, index, is_side_style);
      case 'checkbox':
        return getCheckbox(field, index, is_side_style);
      case 'radio':
        return getRadio(field, index, is_side_style);
      case 'country':
        return getCountry(field, index, is_side_style);
      case 'position':
        return getPosition(field, index, is_side_style);
      case 'hidden':
        return getHiddenInput(field, index);
    }
  })(field);

}

const inputName = (field) => {
  switch (field.en_type) {
    case 'GEN':
    case 'OPT':
      return `supporter.questions.${field.id}`;
    case 'Field':
    default:
      return `supporter.${field.property}`;
  } 
};

const getHiddenInput = (field, index) => {
  const input_name = inputName(field);
  return (
    <input 
      key={index} 
      type="hidden" 
      name={input_name} 
      value={field.default_value}
      readOnly={true} />
  );
}

const getTextInput = (field, index, is_side_style) => {
  const input_name = inputName(field);
  const placeholder = is_side_style ? ''
    : `${field.label} ${field.name.includes('Birth') ? '(yyyy-mm-dd)' : ''}`;

  return (
    <div 
      className={`en__field en__field--text en__field--${field.id} en__field--${field.property}`}
      key={index}
    >
      <div 
        className="en__field__element en__field__element--text form-group" 
        style={field.en_type === 'GEN' ? {display: "flex", "flex-direction": "row"} : {display: "block"} }
      >
        {is_side_style &&
          <label 
            className="en__field__top__label"
            htmlFor={`en__field_supporter_questions_${ field.id }`}
          >
            {field.label} {field.required ? '*' : ''}
          </label>
        }
        <input 
          id={`en__field_supporter_${ field.property }`}
          name={ input_name }
          type={ 'phoneNumber' == field.name ? 'tel' : field.input_type }
          className="en__field__input en__field__input--text form-control"
          defaultValue={ field.default_value }
          data-validate_regex={ field.js_validate_regex }
          data-validate_regex_msg={ field.js_validate_regex_msg }
          data-validate_callback={ field.js_validate_function }
          placeholder={ placeholder }
          required={field.required || field.input_type === 'email'}
          size="40"/>
      </div>
    </div>
  );
}

const getCheckbox = (field, index, is_side_style) => {
  return field.en_type === 'GEN'
    ? getCheckboxGen(field, index, is_side_style)
    : getCheckboxOpt(field, index, is_side_style);
}

const getCheckboxOpt = (field, index, is_side_style) => {
  const input_name = inputName(field);
  const locale = field.selected_locale;
  const dependent_field = '';
  const errorMessage = __( 'This field is required', 'planet4-engagingnetworks' )

  return (
    <div 
      className={`en__field en__field--check en__field--${field.id}`}
      key={index}
    >
      <div 
        className="en__field__element en__field__element--check form-group form-check-label-block custom-control p4-custom-control-input"
      >
        <label className="custom-checkbox">
        <input
          id={`en__field_supporter_questions_${field.id}`}
          name={ input_name }
          type="checkbox"
          className={`en__field__input en__field__input--checkbox ${field.name == dependent_field ? 'dependency-' + field.name : '' }`}
          defaultValue={ field.default_value }
          data-errormessage={ errorMessage }
          defaultChecked={ 1 == field.selected }
          required={ 'true' == field.required }
          disabled={ field.name == dependent_field }
          data-dependency={ field.dependency }
        />
        <span className="custom-control-description">
          { field.label }{ 'true' == field.required ? '*' : '' }
        </span>
        </label>
      </div>
    </div>
  );
}

const getCheckboxGen = (field, index, is_side_style) => {
  const input_name = inputName(field);
  const locale = field.selected_locale;
  const question_option={};
  const errorMessage = __( 'This field is required', 'planet4-engagingnetworks' );

  return (
    <div 
      className={`en__field en__field--check en__field--${field.id}`}
      key={index}
    >
      <div className="en__field__element en__field__element--check form-group form-check-label-block custom-control p4-custom-control-input">
        <label className="custom-checkbox">
          <input
            id={`en__field_supporter_questions_${field.id}${index}`}
            name={ input_name }
            type="checkbox"
            className={`en__field__input en__field__input--checkbox ${field.name == dependent_field ? 'dependency-' + field.name : '' }`}
            defaultValue={ question_option.option_value }
            data-errormessage={ errorMessage }
            defaultChecked={ question_option.option_selected }
            required={ 'true' == field.required }
            disabled={ field.name == dependent_field }
            data-dependency={ field.dependency }
          />
          <span className="custom-control-description">
            { question_option.option_label }
          </span><br />
        </label>
      </div>
    </div>
  );
}

const getRadio = (field, index, is_side_style) => {
  const input_name = inputName(field);

  const options = field.radio_options[field.locale] || [];
  const inputs = options.map((opt, index) => {
    return (
      <div className={`en__field en__field--check en__field--${field.id}`}>
        <div className="en__field__element en__field__element--check form-group form-check-label-block custom-control p4-custom-control-input">
          <label className="custom-radio">
            <input
              id={`en__field_supporter_questions_${field.id}${index}`}
              name={ input_name }
              type="radio"
              className="en__field__input en__field__input--radio"
              value={ opt.option_value }
              data-errormessage={ __( 'This field is required', 'planet4-engagingnetworks' ) }
              checked={ opt.option_selected }
              required={ field.required }
            />
            <span className="custom-control-description">
              { opt.option_label }
            </span><br />
          </label>
        </div>
      </div>
    )
  });

  if (inputs.length <= 0) {
    return null;
  }

  return (
    <div key={index} className="en__field">
      <span className="custom-control-description">
        {field.label}
      </span><br />
      { inputs }
    </div>
  );
}

const getCountry = (field, index, is_side_style) => {
  const input_name = inputName(field);
  const props = {
    name: input_name,
    default_text: is_side_style ? '' : __( 'Select Country or Region', 'planet4-engagingnetworks' ),
    class_name: `en__field__input en__field__input--select en_select_country form-control`,
    error_message: __( 'Please select a country.', 'planet4-engagingnetworks' ),
    required: field?.required || false,
  };

  return (
    <div 
      className={`en__field en__field--${field.id} en__field--${field.property} en__field--select`} 
      key={index}
    >
      <div className="en__field__element en__field__element--select form-group">
        {is_side_style &&
          <label className="en__field__top__label" htmlFor={input_name}>
            {field.label} {field.required ? '*' : ''}
          </label>
        }
        <CountrySelector {...props} />
      </div>
    </div>
  );
}

const getPosition = (field, index, is_side_style) => {
  const input_name = inputName(field);
  const props = {
    id: `en__field_supporter_${field.name}`,
    name: input_name,
    class_name: `en__field__input en__field__input--select en_select_position form-control`,
    default_text: is_side_style ? '' : __( 'Select Affiliation, Position or Profession', 'planet4-engagingnetworks' ),
    error_message: __( 'Please select a position.', 'planet4-engagingnetworks' ),
    required: field?.required || false,
  };

  return (
    <div 
      className={`en__field en__field--${field.id} en__field--${field.property} en__field--select`} 
      key={index}
    >
      <div className="en__field__element en__field__element--select form-group">
        {is_side_style &&
          <label className="en__field__top__label" htmlFor={input_name}>
            {field.label} {field.required ? '*' : ''}
          </label>
        }
        <PositionSelector {...props} />
      </div>
    </div>
  );
}