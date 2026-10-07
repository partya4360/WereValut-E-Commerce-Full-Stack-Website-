import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/product.css';
import { API_BASE_URL } from '../config';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setSelectedPhotoIndex(0);
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        if (!res.ok) throw new Error('Could not load product');

        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const photos = product
    ? [product.imageUrl, ...(product.galleryImages || []).map((photo) => photo.url)]
    : [];

  const showPreviousPhoto = () => {
    setSelectedPhotoIndex((currentIndex) => (currentIndex - 1 + photos.length) % photos.length);
  };

  const showNextPhoto = () => {
    setSelectedPhotoIndex((currentIndex) => (currentIndex + 1) % photos.length);
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1
      }));
      alert('Successfully added to your cart!');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Product Not Found</div>;

  return (
    <div className="product-detail-wrapper">

      {/* Breadcrumb Navigation */}
      <div style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: '#f97316' }}>Home</Link> / <Link to="/shop" style={{ color: '#f97316' }}>Shop</Link> / {product.category} / <span style={{ color: '#fff' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="detail-gallery">
          <div className="detail-main-image">
            {photos.length > 1 && (
              <button type="button" className="detail-gallery-arrow detail-gallery-previous" onClick={showPreviousPhoto} aria-label="Previous product photo">
                &lsaquo;
              </button>
            )}
            <img
              src={photos[selectedPhotoIndex] || product.imageUrl}
              alt={`${product.name} photo ${selectedPhotoIndex + 1}`}
              className="detail-image"
            />
            {photos.length > 1 && (
              <button type="button" className="detail-gallery-arrow detail-gallery-next" onClick={showNextPhoto} aria-label="Next product photo">
                &rsaquo;
              </button>
            )}
          </div>
          {photos.length > 1 && (
            <div className="detail-thumbnails" aria-label="Product photos">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={`${photo}-${index}`}
                  className={`detail-thumbnail${selectedPhotoIndex === index ? ' is-active' : ''}`}
                  onClick={() => setSelectedPhotoIndex(index)}
                  aria-label={`Show product photo ${index + 1}`}
                  aria-pressed={selectedPhotoIndex === index}
                >
                  <img src={photo} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <h2>{product.name}</h2>

          <p className="detail-price">₹{product.price.toFixed(2)}</p>

          <div className="detail-description">
            <h4>Product Description</h4>
            <p>{product.description}</p>
          </div>

          <button onClick={handleAddToCart} className="btn detail-cart-button">
            Add to Shopping Cart
          </button>

          <p className={`detail-stock${product.stock > 0 ? ' in-stock' : ' out-of-stock'}`}>
            {product.stock > 0 ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;