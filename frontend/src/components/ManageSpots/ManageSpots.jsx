import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import './ManageSpots.css';

function ManageSpots() {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState({ previewImage: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = e => {
    e.preventDefault();
    setErrors({});

  };

  return (
    <>
      <form onSubmit={handleSubmit} className='create-spot-form'>
        <h1>Update your Spot</h1>

        <div className='location'>
          <h2>Where&apos;s your place located?</h2>
          <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>

          <label className='country'>
            Country {errors.country && <span className='err'>{errors.country}</span>}
            <input
              type='text'
              name='country'
              placeholder='Country'
              required
              value={country}
              onChange={e => setCountry(e.target.value)}
            />
          </label>
          <label className='address'>
            Street Address {errors.address && <p className='err'>{errors.address}</p>}
            <input
              type='text'
              name='address'
              placeholder='Address'
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </label>
          <label className='city'>
            City {errors.city && <p className='err'>{errors.city}</p>}
            <input
              type='text'
              name='city'
              placeholder='City'
              required
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </label>
          <span className='comma'>,</span>
          <label className='state'>
            State {errors.state && <p className='err'>{errors.state}</p>}
            <input
              type='text'
              name='state'
              placeholder='State'
              required
              value={state}
              onChange={e => setState(e.target.value)}
            />
          </label>
          <label className='lat'>
            Latitude {errors.lat && <p className='err'>{errors.lat}</p>}
            <input
              type='number'
              name='latitude'
              placeholder='Latitude'
              required
              value={lat}
              onChange={e => setLat(e.target.value)}
            />
          </label>
          <span className='comma'>,</span>
          <label className='lng'>
            Longitude {errors.lng && <p className='err'>{errors.lng}</p>}
            <input
              type='number'
              name='longitude'
              placeholder='Longitude'
              required
              value={lng}
              onChange={e => setLng(e.target.value)}
            />
          </label>
        </div>

        <div className="bar" />

        <div className='description'>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.</p>

          <textarea
            name='description'
            placeholder='Please write at least 30 characters'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {errors.description && <p className='err'>{errors.description}</p>}
        </div>

        <div className="bar" />

        <div className='title'>
          <h2>Create a title for your spot</h2>
          <p>Catch guest&apos;s attention with a spot title that highlights what makes
            your place special.</p>

          <input
            type="text"
            name='name'
            placeholder='Name of your spot'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <p className='err'>{errors.name}</p>}
        </div>

        <div className='bar' />

        <div className='price'>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher
            in search results.</p>

          <label>
            $
            <input
              type="number"
              name='price'
              placeholder='Price per night (USD)'
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </label>
          {errors.price && <p className='err'>{errors.price}</p>}
        </div>

        <div className='bar' />

        <div className='photos'>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>

          <input
            type="text"
            name='preview-image'
            placeholder='Preview Image URL'
            required
            value={images.previewImage}
            onChange={e => setImages({ ...images, previewImage: e.target.value })}
          />
          {errors.previewImage && <p className='err'>{errors.previewImage}</p>}
          <input
            type="text"
            name='image'
            placeholder='Image URL'
            value={images.imageTwo}
            onChange={e => setImages({ ...images, imageTwo: e.target.value })}
          />
          <input
            type="text"
            name='image'
            placeholder='Image URL'
            value={images.imageThree}
            onChange={e => setImages({ ...images, imageThree: e.target.value})}
          />
          <input
            type="text"
            name='image'
            placeholder='Image URL'
            value={images.imageFour}
            onChange={e => setImages({ ...images, imageFour: e.target.value})}
          />
          <input
            type="text"
            name='image'
            placeholder='Image URL'
            value={images.imageFive}
            onChange={e => setImages({ ...images, imageFive: e.target.value})}
          />
        </div>

        <div className='bar' />

        <button disabled={Object.values(errors).length}>Create Spot</button>
      </form>
    </>
  )
}

export default ManageSpots;
