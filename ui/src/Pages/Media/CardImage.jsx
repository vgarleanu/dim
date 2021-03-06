import { useState, useEffect } from "react";

function CardImage(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setErr] = useState(false);
  const [imgSrc, setImgSrc] = useState();

  useEffect(() => {
    if (props.src === undefined) return;

    const img = new Image();

    img.onload = () => {
      setImgSrc(img.src);
      setLoaded(true);
      setErr(false);
    };

    img.onerror = () => {
      setLoaded(true);
      setErr(true);
    };

    img.src = new RegExp("/^(?:/|[a-z]+://)/").test(props.src)
      ? props.src : `/${props.src}`;
  }, [props.src]);

  return (
    <div className="cardImageWrapper">
      {(loaded && !error) && (
        <img src={imgSrc} alt="cover"/>
      )}
      {(loaded && error) && (
        <div className="placeholder"/>
      )}
    </div>
  );
}

export default CardImage;
