/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  filterProducts,
  setBrand,
  setSpec,
  setImg,
  sortByPrice,
  isOpenSidebar,
  setAdmin,
  deletingProduct,
  setLogin,
} from "../../actions/actions";
import "./MainPage.css";
import Product from "./Product";

function MainPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const sortProducts = useSelector((state) => state.sortProducts);
  const sortParams = useSelector((state) => state.sortParams);
  const curImg = useSelector((state) => state.img);
  const isOpen = useSelector((state) => state.isOpenSidebar);
  const isAdmin = useSelector((state) => state.isAdmin);
  const deletedProducts = useSelector((state) => state.deletedProducts);
  const isLogginned = useSelector((state) => state.isLogginned);

  if(!isAdmin && localStorage.getItem('isAdmin')){
    dispatch(setAdmin())
  }
  if(!isLogginned && localStorage.getItem('isLogginned')){
    dispatch(setLogin())
  }

  useEffect(() => {
    if(localStorage.getItem('deletedPr')){
      dispatch(deletingProduct(JSON.parse(localStorage.getItem('deletedPr'))))
    }
    dispatch(fetchProducts);
    if (sortParams.sortedBrand.length > 0) {
      for (let param of sortParams.sortedBrand) {
        document.querySelector(`#${param}_ch`).checked = true;
      }
    }
    if (sortParams.sortedSpec.length > 0) {
      for (let spec of sortParams.sortedSpec) {
        let specA = spec
          .toString()
          .split("")
          .map((l) => {
            if (l === " " || l === "." || l === ",") {
              l = "_";
              return l;
            }
            return l;
          })
          .join("");
        document.querySelector(`#_${specA}_ch`).checked = true;
      }
    }
  }, []);

  useEffect(() => {
    dispatch(filterProducts());
  }, [sortParams.sorted]);

  const list = sortProducts.map((product) => {
    return (
      <Product
        key={product.id}
        imageURL={product.imageURL}
        name={product.name}
        price={product.price}
        priceN={product.priceN}
        specifications={product.specification}
        id={product.id}
        brand ={product.brand}
      />
    );
  });

  const listOfBrands = () => {
    const objOfBrands = {};
    for (let product of products) {
      if (objOfBrands[product.brand]) objOfBrands[product.brand] += 1;
      else objOfBrands[product.brand] = 1;
    }
    return Object.keys(objOfBrands).map((brand, key) => {
      let brandL = brand.split("");
      brandL[0] = brandL[0].toUpperCase();
      brandL = brandL.join("");
      return (
        <li key={`${brand}_${key}`}>
          <input
            id={`${brand}_ch`}
            type="checkbox"
            onChange={(e) => {
              dispatch(setBrand(e, brand));
              dispatch(filterProducts());
            }}
          />
          <label htmlFor={`${brand}_ch`}>{brandL}</label>
          <span className="numParams">({objOfBrands[brand]})</span>
        </li>
      );
    });
  };

  const listOfSpecifications = () => {
    const objOfSpecification = {};
    for (let product of products) {
      for (let spec of Object.keys(product.specification)) {
        if (objOfSpecification[product.specification[spec][0]]) continue;
        else objOfSpecification[product.specification[spec][0]] = {};
      }
    }
    for (let product of products) {
      for (let spec of Object.keys(product.specification)) {
        if (
          objOfSpecification[product.specification[spec][0]][
            product.specification[spec][1]
          ]
        ) {
          objOfSpecification[product.specification[spec][0]][
            product.specification[spec][1]
          ] += 1;
        } else {
          objOfSpecification[product.specification[spec][0]][
            product.specification[spec][1]
          ] = 1;
        }
      }
    }

    return Object.keys(objOfSpecification).map((titleSpec) => {
      const list = Object.keys(objOfSpecification[titleSpec]).map(
        (spec, key) => {
          let specA = spec
            .toString()
            .split("")
            .map((l) => {
              if (l === " " || l === "." || l === ",") {
                l = "_";
                return l;
              }
              return l;
            })
            .join("");
          return (
            <li key={`${specA}_${key}_s`}>
              <input
                id={`_${specA}_ch`}
                type="checkbox"
                onChange={(e) => {
                  dispatch(setSpec(e, spec));
                  dispatch(filterProducts());
                }}
              />
              <label htmlFor={`_${specA}_ch`}>{spec}</label>
              <span className="numParams">
                ({objOfSpecification[titleSpec][spec]})
              </span>
            </li>
          );
        }
      );
      return (
        <>
          <h3 key={`${titleSpec}_sp`}>{`${titleSpec}:`}</h3>
          {list}
        </>
      );
    });
  };
  const ar = useRef();
  const sortBy = () => {
    if (document.querySelector(".arrow").classList[1])
      document.querySelector(".arrow").classList.remove("rotated");
    else document.querySelector(".arrow").classList.add("rotated");
    dispatch(sortByPrice());
    dispatch(filterProducts());
  };

  const closeImg = () => {
    dispatch(setImg());
  };

  const sideB = useRef();
  const openSide = () => {
    dispatch(isOpenSidebar());
    let leftSideB = -260;
    const timer = setInterval(() => {
      if (leftSideB >= -5) clearInterval(timer);
      leftSideB += 3;
      sideB.current.style.left = leftSideB + "px";
    }, 1);
  };
  const closeSide = () => {
    dispatch(isOpenSidebar());
    let leftSideB = 0;
    const timer = setInterval(() => {
      if (leftSideB <= -260) clearInterval(timer);
      leftSideB -= 3;
      sideB.current.style.left = leftSideB + "px";
    }, 1);
  };

  const resetProducts = e => {
    e.preventDefault();
    fetch('http://localhost:3001/products',{method:'post', headers:{
    "Content-Type": "application/json"
  },
  body: JSON.stringify(deletedProducts[deletedProducts.length-1]) 
})
  let parsedStore = JSON.parse(localStorage.getItem('deletedPr'));
  if(parsedStore.length === 1) localStorage.removeItem('deletedPr')
  else{
  parsedStore.pop();
  localStorage.setItem('deletedPr',JSON.stringify(parsedStore));
  }
  }

  return (
    <>
     {isAdmin && localStorage.getItem('deletedPr') ? <button className="resetBut" onClick={resetProducts}>??????????????</button> : null}
      {curImg ? (
        <div className="wrap" onClick={closeImg}>
          <div className="root">
            <img src={curImg} alt="product" />
          </div>
        </div>
      ) : null}

      <div className="container" id="main">
        <div className="sortedDiv" onClick={sortBy}>
          <span className="arrow" ref={ar}>
           {'>'}
          </span>
          ?????????????????????? ???? ????????
        </div>
        <div id="sidebar" ref={sideB}>
          <div id="sideFilt">
            <h3>????????????:</h3>
            <ul>
              {listOfBrands()}
              {listOfSpecifications()}
            </ul>
          </div>
          <button
            id="openSide"
            className={isOpen ? "rotatedSide" : ""}
            onClick={!isOpen ? openSide : closeSide}
          >
            {'>'}
          </button>
        </div>

        <div id="content">{list}</div>
      </div>
    </>
  );
}

export default MainPage;
