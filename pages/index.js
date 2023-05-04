import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Input from 'components/Input';
import { withAuth } from 'utils/auth';
import FormServices from 'services/FormServices';
import styles from 'styles/Home.module.css';
function Home() {
  const [name, setName] = useState('');
  const [files, setFiles] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileErrorMessage, setFileErrorMessage] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();
  const drop = useRef();
  const windowWidth = useRef(window.innerWidth);

  useEffect(() => {
    drop.current.addEventListener('dragover', handleDragOver);
    drop.current.addEventListener('drop', handleDrop);
    drop.current.addEventListener('dragenter', handleDragEnter);
    drop.current.addEventListener('dragleave', handleDragLeave);

    return () => {
      drop.current.removeEventListener('dragover', handleDragOver);
      drop.current.removeEventListener('drop', handleDrop);
      drop.current.removeEventListener('dragenter', handleDragEnter);
      drop.current.removeEventListener('dragleave', handleDragLeave);
    };
  }, []);
  //Function that sets file and image to show preview
  const sendImage = (file) => {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFiles(file);
  };
  //Function that gets the value of input name
  const handleChangeNameImg = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  //Functions I use to handle drag an drop event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };
  //Function to generate a validation for the extension of the image
  function validateImageExtension(fileName) {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = fileName.slice(fileName.lastIndexOf('.'));
    return validExtensions.includes(extension.toLowerCase());
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileErrorMessage('');
    let imageFile = e.dataTransfer.files[0];
    if (validateImageExtension(imageFile.name)) {
      sendImage(imageFile);
    } else {
      setFileErrorMessage('Solo se aceptan archivos de tipo imagen');
    }
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    setSuccess(false);
    setErrorMessage('');
    setFileErrorMessage('');
    e.preventDefault();
    const { ok, data } = await FormServices.save({
      name,
      files,
    });
    if (ok) {
      setSuccess(true);
    } else {
      setErrorMessage(data);
    }
  };

  return (
    <>
      <div className={styles.headerContainer}></div>
      <div className={styles.mainContainer}>
        <main className={styles.container}>
          <div>
            <h1 className={styles.title}>¡Subí tus fotos!</h1>
            <Input
              className={styles.input}
              name="name"
              label="Nombre de la imagen"
              handleChange={handleChangeNameImg}
              size="large"
            />
          </div>
          <div
            className={styles.dragAndDropConteiner}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            ref={drop}
          >
            {!files && windowWidth.current < 480 && (
              <p>Subí tu imagen favorita</p>
            )}
            {!files && !isDragging && windowWidth.current > 480 && (
              <p>Arrastra la imagen a esta zona</p>
            )}
            <Input
              className={styles.inputImg}
              name="files"
              accept="image/*"
              multiple={true}
              handleChange={(e) => {
                e.preventDefault();
                setFiles(e.target.files[0]);
                sendImage(e.target.files[0]);
              }}
              type="file"
              hidden
              innerRef={inputRef}
            />
            {isDragging && (
              <p className={styles.validationDragging}>Soltá la imagen acá</p>
            )}
            {previewUrl && (
              <div className={styles.imgContainer}>
                {/*I should have added a new rule to the .eslintrc file: "@next/next/no-img-element": "off" */}
                <img
                  src={previewUrl}
                  style={{ width: '120px' }}
                  alt="Preview"
                />
              </div>
            )}
            {!isDragging && (
              <button
                className={styles.btnLoadImg}
                onClick={() => inputRef.current.click()}
              >
                Subir Archivo{' '}
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.99984 10.6671C7.74012 10.6671 7.52226 10.5791 7.34626 10.4031C7.17026 10.2271 7.08256 10.0095 7.08317 9.75039V3.19622L5.36442 4.91497C5.18109 5.09831 4.9672 5.18997 4.72276 5.18997C4.47831 5.18997 4.25678 5.09067 4.05817 4.89206C3.87484 4.70872 3.78714 4.49117 3.79509 4.23939C3.80303 3.98761 3.89073 3.77739 4.05817 3.60872L7.35817 0.308724C7.44984 0.217057 7.54914 0.152279 7.65609 0.11439C7.76303 0.0765015 7.87762 0.0572517 7.99984 0.0566406C8.12206 0.0566406 8.23664 0.0758904 8.34359 0.11439C8.45053 0.15289 8.54984 0.217668 8.64151 0.308724L11.9415 3.60872C12.1248 3.79206 12.2128 4.00992 12.2055 4.26231C12.1982 4.5147 12.1102 4.72461 11.9415 4.89206C11.7582 5.07539 11.5403 5.17103 11.2879 5.17897C11.0355 5.18692 10.818 5.09892 10.6353 4.91497L8.91651 3.19622V9.75039C8.91651 10.0101 8.82851 10.228 8.65251 10.404C8.47651 10.58 8.25895 10.6677 7.99984 10.6671ZM2.49984 14.3337C1.99567 14.3337 1.56392 14.1541 1.20459 13.7947C0.845255 13.4354 0.665894 13.0039 0.666505 12.5004V10.6671C0.666505 10.4073 0.754506 10.1895 0.930506 10.0135C1.10651 9.83747 1.32406 9.74978 1.58317 9.75039C1.84289 9.75039 2.06076 9.83839 2.23676 10.0144C2.41276 10.1904 2.50045 10.4079 2.49984 10.6671V12.5004H13.4998V10.6671C13.4998 10.4073 13.5878 10.1895 13.7638 10.0135C13.9398 9.83747 14.1574 9.74978 14.4165 9.75039C14.6762 9.75039 14.8941 9.83839 15.0701 10.0144C15.2461 10.1904 15.3338 10.4079 15.3332 10.6671V12.5004C15.3332 13.0046 15.1535 13.4363 14.7942 13.7956C14.4348 14.155 14.0034 14.3343 13.4998 14.3337H2.49984Z"
                    fill="#B700FF"
                  />
                </svg>
              </button>
            )}
          </div>
          {fileErrorMessage && (
            <p className={styles.error}>{fileErrorMessage}</p>
          )}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {success && <p className={styles.success}>Enviado con éxito</p>}
          <Button
            className={styles.button}
            disabled={!name || !files}
            label="Enviar"
            size="medium"
            handleClick={handleSubmit}
          />
        </main>
      </div>
    </>
  );
}

Home.defaultProps = {
  handleChange: () => {},
  errorMessage: '',
  label: '',
  files: null,
  image: null,
  fileErrorMessage: '',
};

Home.propTypes = {
  handleDragEnter: PropTypes.func,
  handleDragOver: PropTypes.func,
  handleDragLeave: PropTypes.func,
  handleDrop: PropTypes.func,
  sendImage: PropTypes.func,
  handleChangeNameImg: PropTypes.func,
  handleSubmit: PropTypes.func,
  errorMessage: PropTypes.string,
  fileErrorMessage: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  files: PropTypes.object,
  previewUrl: PropTypes.string,
  image: PropTypes.object,
};
// ToDo: use withAuth High Order Component to force authentication for this page.
export default withAuth(Home);
