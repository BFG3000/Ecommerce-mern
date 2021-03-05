import React,{useState} from 'react';

const Search = ({history}) => {
   const [keyword, setKeyword] = useState('') 

  const searchHandler = (e) => {
      e.preventDefault()
      if (keyword.trim()){
          history.push(`/search/${keyword}`)
      }else{
          history.push('/')
      }
  };
  return (
    <>
      <form onSubmit={searchHandler}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="search_field"
            placeholder="Search product name"
            onChange={(e)=>setKeyword(e.target.value)}
            value={keyword}
          />
          <div className="input-group-append">
            <button className="btn" id="search_btn">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Search;
