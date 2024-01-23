import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spotsReducer';
import './DeleteSpotModal.css';

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    return dispatch(deleteSpot(spotId))
      .then(closeModal);
  };

  return (
    <div className='delete-spot-modal'>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button className='delete-button' onClick={handleDelete}>Yes (Delete Spot)</button>
      <button className='keep-button' onClick={closeModal}>No (Keep Spot)</button>
    </div>
  )
}

export default DeleteSpotModal;
