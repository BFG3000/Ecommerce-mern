import React, { useEffect, useState } from 'react';
import MetaData from '../../../components/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, getProductDetails, clearErrors } from '../../../actions/productActions';
import { toastError, toastSuccess } from '../../../util/Notification/toast';
import { UPDATE_PRODUCT_RESET } from '../../../constants/productConstants';
import Sidebar from '../../../components/Sidebar/Sidebar';

const categorylist = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home',
];

const UpdateProduct = ({ history, match }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [oldImages, setOldImages] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [category, setCategory] = useState(categorylist[0]);
    const [seller, setSeller] = useState('');
    const [stock, setStock] = useState(0);

    const dispatch = useDispatch();

    const { error: updateError, success } = useSelector((state) => state.productud);
    const { loading, error: productError, product } = useSelector((state) => state.productDetails);

    const productId = match.params.id;

    useEffect(() => {
        if (product && product._id !== productId) {
            dispatch(getProductDetails(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSeller(product.seller);
            setStock(product.stock);
            setOldImages(product.images)
        }

        if (updateError || productError) {
            toastError(productError ? productError : updateError);
            dispatch(clearErrors());
        }
        if (success) {
            history.push('/admin/products');
            toastSuccess('Product updated successfully!');
            dispatch({ type: UPDATE_PRODUCT_RESET });
        }
    }, [dispatch, history, product, productError, productId, success, updateError]);

    const submitHandler = (e) => {
        e.preventDefault();

        const updatedProduct = {
            name,
            price,
            description,
            category,
            seller,
            stock,
            images,
        };
        dispatch(updateProduct(product._id, updatedProduct));
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);

        //just in cause of user selecting images more than once
        setImagesPreview([]);
        setImages([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [...oldArray, reader.result]);
                    setImages((oldArray) => [...oldArray, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    return (
        <>
            <MetaData title="Edit Product" />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" encType="multipart/form-data" onSubmit={submitHandler}>
                                <h1 className="mb-4">Update Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="number"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description_field"
                                        rows="8"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select
                                        className="form-control"
                                        id="category_field"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {categorylist.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Images</label>

                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            name="product_images"
                                            className="custom-file-input"
                                            id="customFile"
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className="custom-file-label" htmlFor="customFile">
                                            Choose Images
                                        </label>
                                    </div>
                                    {oldImages && oldImages.map((image) => (
                                        <img src={image.url} key={image} alt="ImagePreview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                    {imagesPreview.map((image) => (
                                        <img src={image} key={image} alt="ImagePreview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                </div>

                                <button id="login_button" type="submit" className="btn btn-block py-3" disabled={loading ? true : false}>
                                    UPDATE
                                </button>
                            </form>
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

export default UpdateProduct;
