import "../../styles/result/Card.css";
import grayImage from "../../assets/img_result/gray.svg";
import MoveShopping from "./MoveShopping";
import { useState, useEffect } from "react";
import axios from "axios";

const Card = ({ inventory }) => {
  const [click, setClick] = useState(false);

  const onCloseEvent = () => {
    setClick(false);
  };

  return (
    <div>
      <div
        className="Card"
        onClick={() => {
          setClick(true);
        }}
      >
        <img
          src={inventory.changedImage || inventory.image}
          alt="제품 사진"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = grayImage;
          }}
        />
        <div className="text">
          <h6 dangerouslySetInnerHTML={{ __html: inventory.title }} />
          <h5>{inventory.price.toLocaleString()}원</h5>
        </div>
      </div>
      {click && (
        <MoveShopping
          img={inventory.changedImage || inventory.image}
          title={inventory.title}
          link={inventory.link}
          onClose={onCloseEvent}
        />
      )}
    </div>
  );
};

export default Card;
