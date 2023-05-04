import PropTypes from 'prop-types';
import cn from 'utils/classNames';
import styles from './Input.module.css';

/** Styled reusable form's Input component. */
const Input = ({
  handleChange,
  className,
  label,
  errorMessage,
  innerRef,
  ...props
}) => {
  return (
    <>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={innerRef}
        className={cn(styles.input, styles[props.size], className)}
        onChange={handleChange}
        {...props}
      />
      {errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </>
  );
};

Input.defaultProps = {
  handleChange: () => {},
  errorMessage: '',
  label: '',
};

Input.propTypes = {
  handleChange: PropTypes.func,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
};

export default Input;
