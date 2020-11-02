import React, { useContext, useState } from 'react';
import bemCssModules from 'bem-css-modules';

import Modal from '../../Modal/Modal';
import request from '../../../helpers/request';
import { StoreContext } from '../../../store/StoreProvider';

import { default as CoursePopupStyles } from './CoursePopup.module.scss';

const style = bemCssModules(CoursePopupStyles);

const CoursePopup = ({
  authors = [],
  hidePopup,
  isEditMode = true,
  isOpenPopup,
  id,
  img = '',
  price = 0,
  title = ''
}) => {
  const [formAuthors, setFormAuthors] = useState(authors);
  const [formAuthor, setAuthor] = useState('');
  const [formImg, setFormImg] = useState(img);
  const [formPrice, setFormPrice] = useState(price);
  const [formTitle, setFormTitle] = useState(title);

  const { setCourses } = useContext(StoreContext);

  const handleOnChangeAuthor = e => setAuthor(e.target.value);
  const handleOnChangeImg = e => setFormImg(e.target.value);
  const handleOnChangePrice = e => setFormPrice(e.target.value);
  const handleOnChangeTitle = e => setFormTitle(e.target.value);

  const handleOnSubmit = async event => {
    event.preventDefault();

    const courseObject = {
      authors: formAuthors,
      id,
      img: formImg,
      price: Number(formPrice),
      title: formTitle
    };

    if (isEditMode) {
      // courseObject.id = id;
      const { data, status } = await request.put('/courses', courseObject);

      if (status === 202) {
        setCourses(data.courses);
      }
    }else {
        const { data, status } = await request.post('/courses', courseObject);

        if (status === 201) {
          setCourses(data.courses);
        };
      };

    hidePopup();
  };

  const addAuthor = e => {
    e.preventDefault();

    setFormAuthors(prev => [...prev, formAuthor]);
    setAuthor('');
  };

  const deleteAuthor = e => {
    const authorToDelete = e.target.dataset.author;
    setFormAuthors(prev => prev.filter(author => author !== authorToDelete));
  };

  const authorsElements = formAuthors.map(author => (
    <li key={author}>
      <p>{author}</p>
      <button data-author={author} onClick={deleteAuthor}>Usuń</button>
    </li>
  ));

  const correntLabel = isEditMode ? "Aktualizuj kurs" : "Utwórz kurs";

  return ( 
    <Modal handleOnClose={hidePopup} isOpen={isOpenPopup}>
      <div className={style()}>
        <form className={style('form')} method="submit" onSubmit={handleOnSubmit} >
          <div className={style('form-row')}>
            <label>
              Autor:
              <input type="text" onChange={handleOnChangeAuthor} className={style('input')} value={formAuthor} />
              <button onClick={addAuthor}>Dodaj autora</button>
            </label>
          </div>
          <div className={style('form-row')}>
            Obrazek url:
            <input type="text" onChange={handleOnChangeImg} className={style('input')} value={formImg} />
          </div>
          <div className={style('form-row')}>
            Cena:
            <input type="number" onChange={handleOnChangePrice} className={style('input')} value={formPrice} />           
          </div>
          <div className={style('form-row')}>
            Tytuł:
            <input type="text" onChange={handleOnChangeTitle} className={style('input')} value={formTitle} />          
          </div>
          <button type='submit'>{correntLabel}</button>
          <button onClick={hidePopup} type="button">Anuluj</button>
        </form>
        <p>Lista autorór:</p>
        <ul>
          {authorsElements}
        </ul>
      </div>

    </Modal>
   );
}
 
export default CoursePopup;