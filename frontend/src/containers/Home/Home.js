import React, { useEffect, useState } from 'react';
import MetaData from '../../components/MetaData';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import Product from './Product/Product';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

//slider stuff
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = ({ match }) => {
    const { resPerPage, products, error, productCount, loading, filteredproductCount } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 1000]);
    const [category, setCategory] = useState('');
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

    const keyword = match.params.keyword;

    // const [loading, setLoading] = useState(false);
    // const [Data, setData] = useState([])
    const notify = () => toast('Wow so easy !');
    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        dispatch(getProducts(keyword, currentPage, price, category));
    }, [category, currentPage, dispatch, error, keyword, price]);

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    let count = productCount;
    if (keyword) {
        count = filteredproductCount;
    }
    return (
        <>
            {console.log(products)}
            <button onClick={notify}>Notify !</button>
            {/* wait for data to load //TODO also there is an annoying bug that cause the page to render twice because productCount is undefined in the first time for some reason so i put it with loading condtion for now*/}
            {loading || !productCount ? (
                <Loader />
            ) : (
                <div className="container container-fluid">
                    <MetaData title={'Home'} />
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <>
                                    <div className="col-6 col-md-3 my-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `$1`,
                                                    1000: `$1000`,
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={(value) => `$${value}`}
                                                tipProps={{ placement: 'top', visible: true }}
                                                value={price}
                                                onChange={(price) => setPrice(price)}
                                            />
                                            <hr className="my-5" />
                                            <div className="mt-5">
                                                <h4 className="mb-3">Categories</h4>
                                                <ul className="pl-0">
                                                    {categorylist.map((category) => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none',
                                                            }}
                                                            key={category}
                                                            onClick={() => setCategory(category)}
                                                        >
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 ">
                                        <div className="row">
                                            {products && products.map((product) => <Product key={product._id} product={product} />)}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                products && products.map((product) => <Product key={product._id} product={product} />)
                            )}

                            {/* loop through products array */}
                        </div>
                    </section>
                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={count}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Home;
