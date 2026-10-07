import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/admin-product.css';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [image, setImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setFormData({ name: data.name, description: data.description, price: data.price, category: data.category, stock: data.stock });
      setGalleryImages(data.galleryImages || []);
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);
    galleryFiles.forEach((galleryImage) => data.append('galleryImages', galleryImage));

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
      body: data
    });
    setLoading(false);
    if (res.ok) {
      alert('Product updated successfully!');
      navigate('/admin/products');
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (deletingImageId || !window.confirm('Delete this additional photo?')) return;

    setDeletingImageId(imageId);
    try {
      const res = await fetch(`/api/products/${id}/gallery/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setGalleryImages(data.galleryImages || []);
      } else {
        alert(data.message || 'Could not delete this photo.');
      }
    } catch (error) {
      console.error(error);
      alert('Could not delete this photo.');
    } finally {
      setDeletingImageId(null);
    }
  };

  return (
    <div className="admin-product-shell">
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Edit Product</h2>
      <form onSubmit={handleSubmit} className="admin-product-form">
        <input type="text" placeholder="Product Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        <textarea placeholder="Description" required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={inputStyle} />
        <input type="number" placeholder="Price" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Category" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle} />
        <input type="number" placeholder="Stock" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
        <div className="admin-photo-section">
          <label htmlFor="replace-main-image">Replace Main Photo (Optional)</label>
          <input id="replace-main-image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="admin-file-input" />
        </div>

        <div className="admin-photo-section">
          <label htmlFor="add-gallery-images">Add Additional Photos</label>
          <input
            id="add-gallery-images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
            className="admin-file-input"
          />
          {galleryFiles.length > 0 && (
            <p className="admin-selected-count">{galleryFiles.length} additional photos selected</p>
          )}
        </div>

        {galleryImages.length > 0 && (
          <div className="admin-photo-section">
            <h3>Current Additional Photos</h3>
            <div className="admin-gallery-grid">
              {galleryImages.map((galleryImage) => (
                <div className="admin-gallery-card" key={galleryImage._id}>
                  <img src={galleryImage.url} alt="Product gallery" />
                  <button
                    type="button"
                    className="admin-gallery-delete"
                    disabled={Boolean(deletingImageId)}
                    onClick={() => handleDeleteGalleryImage(galleryImage._id)}
                  >
                    {deletingImageId === galleryImage._id ? 'Deleting...' : 'Delete photo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = { padding: '12px', background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', fontSize: '15px', outline: 'none' };
export default EditProduct;