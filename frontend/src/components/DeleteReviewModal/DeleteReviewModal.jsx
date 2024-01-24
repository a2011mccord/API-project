import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviewsReducer';
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = e => {
    e.preventDefault();

    return dispatch(deleteReview(reviewId))
      .then(closeModal);
  }

  return (
    <div className='delete-review-modal'>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <button className='delete-button' onClick={handleDelete}>Yes (Delete Review)</button>
      <button className='keep-button' onClick={closeModal}>No (Keep Review)</button>
    </div>
  )
}

export default DeleteReviewModal;
